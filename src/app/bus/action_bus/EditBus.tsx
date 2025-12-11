'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/config";
import Link from 'next/link';
import Header from "@/components/Header";

export default function EditBus({ id }: { id: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);

    const [formData, setFormData] = useState({
        kode_bus: "",
        plat_nomor: "",
        kapasitas: "",
        jenis_bus: "",
        status: "", // Hanya untuk display preview, tidak dikirim saat update
    });

    // State untuk Foto
    const [currentFoto, setCurrentFoto] = useState<string | null>(null); // Foto lama dari server
    const [newFotoFile, setNewFotoFile] = useState<File | null>(null);   // Foto baru yg dipilih user
    const [fotoPreview, setFotoPreview] = useState<string | null>(null); // Preview lokal

    // 1. Fetch Data Bus Lama
    useEffect(() => {
        async function fetchBus() {
            try {
                const res = await fetch(`${API_URL}/api/bus/${id}`);
                if (!res.ok) throw new Error("Gagal mengambil data bus");

                const json = await res.json();
                const data = json.data || json;

                setFormData({
                    kode_bus: data.kode_bus || "",
                    plat_nomor: data.plat_nomor || "",
                    kapasitas: data.kapasitas ? String(data.kapasitas) : "",
                    jenis_bus: data.jenis_bus || "",
                    status: data.status || "berhenti",
                });

                if (data.foto) {
                    setCurrentFoto(data.foto);
                }

            } catch (error) {
                console.error(error);
                alert("Data bus tidak ditemukan");
                router.push("/bus");
            } finally {
                setLoadingData(false);
            }
        }
        if (id) fetchBus();
    }, [id, router]);

    // Handle Input Teks
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Handle Input File
    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            setNewFotoFile(file);
            setFotoPreview(URL.createObjectURL(file));
        }
    }

    // 2. Submit Update
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            // Gunakan FormData agar bisa kirim file & teks bersamaan
            const payload = new FormData();
            payload.append("kode_bus", formData.kode_bus);
            payload.append("plat_nomor", formData.plat_nomor);
            payload.append("kapasitas", formData.kapasitas);
            payload.append("jenis_bus", formData.jenis_bus);

            // ⚠️ Status TIDAK dikirim, biarkan backend/sistem maintenance yang mengatur

            if (newFotoFile) {
                payload.append("foto", newFotoFile);
            }

            const response = await fetch(`${API_URL}/api/bus/${id}`, {
                method: "PUT",
                body: payload, // Browser otomatis set Content-Type multipart/form-data
            });

            if (!response.ok) throw new Error("Gagal memperbarui data");

            alert("✅ Data Bus berhasil diperbarui!");
            router.push("/bus");
        } catch (error: any) {
            console.error(error);
            alert(`❌ Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    }

    if (loadingData) return <div className="p-10 text-center">Memuat data edit...</div>;

    return (
        <div className="">
            <Header subtitle="Edit Data" title="Edit Data Bus" />

            <div className="p-6 bg-white rounded-2xl shadow-md">
                <p className="text-sm text-gray-500 mb-6" aria-label="breadcrumb">
                    <Link href="/bus" className="hover:text-blue-600 hover:underline transition-colors">
                        Manajemen Bus
                    </Link>
                    <span className="mx-2">/</span>
                    <span className="font-medium text-gray-700">Edit Bus</span>
                </p>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* --- KOLOM KIRI (Input) --- */}
                    <div className="space-y-4">
                        <div>
                            <label className="block font-medium mb-1">Kode Bus</label>
                            <input type="text" name="kode_bus" value={formData.kode_bus} onChange={handleChange} className="w-full border border-blue-400 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-400" required />
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Plat Nomor</label>
                            <input type="text" name="plat_nomor" value={formData.plat_nomor} onChange={handleChange} className="w-full border border-blue-400 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-400" required />
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Jenis Bus</label>
                            <input type="text" name="jenis_bus" value={formData.jenis_bus} onChange={handleChange} className="w-full border border-blue-400 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-400" required />
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Kapasitas</label>
                            <input type="number" name="kapasitas" value={formData.kapasitas} onChange={handleChange} className="w-full border border-blue-400 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-400" required />
                        </div>

                        {/* Input Foto */}
                        <div>
                            <label className="block font-medium mb-1">Update Foto (Opsional)</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="w-full border border-blue-400 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                            />
                            <p className="text-xs text-gray-400 mt-1">Biarkan kosong jika tidak ingin mengubah foto.</p>
                        </div>
                    </div>

                    {/* --- KOLOM KANAN (PREVIEW) --- */}
                    <div className="space-y-4">
                        <div className="flex flex-col items-center border border-blue-300 rounded-xl p-6 h-full bg-gray-50">
                            <h3 className="text-lg font-semibold text-gray-700 mb-4">Preview Edit</h3>

                            {/* Logic Display Foto: Preview Baru > Foto Lama > Placeholder */}
                            <div className="mb-4 w-full flex justify-center">
                                {fotoPreview ? (
                                    <img src={fotoPreview} alt="Preview Baru" className="w-64 h-40 object-cover rounded-lg shadow-sm border border-green-200" />
                                ) : currentFoto ? (
                                    <img src={`${API_URL}/uploads/${currentFoto}`} alt="Foto Lama" className="w-64 h-40 object-cover rounded-lg shadow-sm border border-gray-200" />
                                ) : (
                                    <div className="w-64 h-40 bg-gray-200 flex flex-col items-center justify-center rounded-lg text-gray-500 shadow-inner">
                                        <span className="text-4xl mb-2">🚌</span>
                                        <span className="text-xs">Tidak ada foto</span>
                                    </div>
                                )}
                            </div>

                            <div className="w-full space-y-3 px-4">
                                <p className="flex justify-between border-b pb-2"><span className="text-gray-500">Plat:</span> <span className="font-medium text-gray-800">{formData.plat_nomor}</span></p>
                                <p className="flex justify-between border-b pb-2"><span className="text-gray-500">Kode:</span> <span className="font-medium text-gray-800">{formData.kode_bus}</span></p>
                                <p className="flex justify-between border-b pb-2"><span className="text-gray-500">Jenis:</span> <span className="font-medium text-gray-800">{formData.jenis_bus}</span></p>
                                <p className="flex justify-between border-b pb-2"><span className="text-gray-500">Kapasitas:</span> <span className="font-medium text-gray-800">{formData.kapasitas} Kursi</span></p>
                                <div className="flex justify-between pt-2">
                                    <span className="text-gray-500">Status Saat Ini:</span>
                                    <span className={`font-bold px-2 py-0.5 rounded text-sm capitalize
                                        ${formData.status === 'berjalan' ? 'bg-green-100 text-green-600' :
                                            formData.status === 'dijadwalkan' ? 'bg-blue-100 text-blue-600' :
                                                formData.status === 'dalam perbaikan' ? 'bg-gray-200 text-gray-600' :
                                                    'bg-orange-100 text-orange-600'}`}>
                                        {formData.status}
                                    </span>
                                </div>
                                <p className="text-xs text-center text-gray-400 mt-1">*Status diatur otomatis oleh sistem.</p>
                            </div>
                        </div>
                    </div>

                    {/* TOMBOL */}
                    <div className="col-span-1 md:col-span-2 flex justify-end space-x-3 mt-4 pt-4 border-t">
                        <Link href="/bus" className="bg-red-100 text-red-600 px-6 py-2 rounded-xl font-medium hover:bg-red-200">Batal</Link>
                        <button type="submit" disabled={loading} className="bg-teal-100 text-teal-700 px-6 py-2 rounded-xl font-medium hover:bg-teal-200">
                            {loading ? "Menyimpan..." : "Update Data"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}