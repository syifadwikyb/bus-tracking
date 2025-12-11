'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/config";
import Link from 'next/link';
import Header from "@/components/Header";

export default function EditDriver({ id }: { id: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);

    const [formData, setFormData] = useState({
        kode_driver: "",
        nama: "",
        tanggal_lahir: "",
        nomor_telepon: "",
        status: "", // Hanya untuk display preview
    });

    const [currentFoto, setCurrentFoto] = useState<string | null>(null);
    const [newFotoFile, setNewFotoFile] = useState<File | null>(null);
    const [fotoPreview, setFotoPreview] = useState<string | null>(null);

    // Fetch Data Lama
    useEffect(() => {
        async function fetchDriver() {
            try {
                const res = await fetch(`${API_URL}/api/drivers/${id}`);
                if (!res.ok) throw new Error("Gagal mengambil data");

                const json = await res.json();
                const data = json.data || json;

                setFormData({
                    kode_driver: data.kode_driver || "",
                    nama: data.nama || "",
                    tanggal_lahir: data.tanggal_lahir || "",
                    nomor_telepon: data.nomor_telepon || "",
                    status: data.status || "berhenti",
                });

                if (data.foto) setCurrentFoto(data.foto);

            } catch (error) {
                console.error(error);
                router.push("/drivers");
            } finally {
                setLoadingData(false);
            }
        }
        if (id) fetchDriver();
    }, [id, router]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            setNewFotoFile(file);
            setFotoPreview(URL.createObjectURL(file));
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = new FormData();
            payload.append("kode_driver", formData.kode_driver);
            payload.append("nama", formData.nama);
            payload.append("tanggal_lahir", formData.tanggal_lahir);
            payload.append("nomor_telepon", formData.nomor_telepon);

            // Status TIDAK dikirim agar tidak merusak logika jadwal

            if (newFotoFile) {
                payload.append("foto", newFotoFile);
            }

            const response = await fetch(`${API_URL}/api/drivers/${id}`, {
                method: "PUT",
                body: payload,
            });

            if (!response.ok) throw new Error("Gagal update data");

            alert("✅ Data Driver diperbarui!");
            router.push("/drivers");
        } catch (error: any) {
            alert(`❌ Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    }

    if (loadingData) return <div className="p-10 text-center">Memuat data edit...</div>;

    return (
        <div className="p-8">
            <Header subtitle="Edit Data" title="Edit Data Driver" />

            <div className="p-6 bg-white rounded-2xl shadow-md">
                <p className="text-sm text-gray-500 mb-6">
                    <Link href="/drivers" className="hover:text-blue-600 hover:underline">Manajemen Driver</Link> / <span className="font-medium text-gray-700">Edit Driver</span>
                </p>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* INPUT */}
                    <div className="space-y-4">
                        <div>
                            <label className="block font-medium mb-1">Kode Driver</label>
                            <input type="text" name="kode_driver" value={formData.kode_driver} onChange={handleChange} className="w-full border border-blue-400 rounded-xl p-2" required />
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Nama Lengkap</label>
                            <input type="text" name="nama" value={formData.nama} onChange={handleChange} className="w-full border border-blue-400 rounded-xl p-2" required />
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Tanggal Lahir</label>
                            <input type="date" name="tanggal_lahir" value={formData.tanggal_lahir} onChange={handleChange} className="w-full border border-blue-400 rounded-xl p-2" required />
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Nomor Telepon</label>
                            <input type="tel" name="nomor_telepon" value={formData.nomor_telepon} onChange={handleChange} className="w-full border border-blue-400 rounded-xl p-2" required />
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Update Foto (Opsional)</label>
                            <input type="file" accept="image/*" onChange={handleFileChange} className="w-full border border-blue-400 rounded-xl p-2 bg-white" />
                        </div>
                    </div>

                    {/* PREVIEW */}
                    <div className="space-y-4">
                        <div className="flex flex-col items-center border border-blue-300 rounded-xl p-6 h-full bg-gray-50">
                            <h3 className="text-lg font-semibold text-gray-700 mb-4">Preview Edit</h3>

                            <div className="mb-4">
                                {fotoPreview ? (
                                    <img src={fotoPreview} className="w-32 h-32 object-cover rounded-full shadow-md border-4 border-green-100" />
                                ) : currentFoto ? (
                                    <img src={`${API_URL}/uploads/${currentFoto}`} className="w-32 h-32 object-cover rounded-full shadow-md border-4 border-gray-200" />
                                ) : (
                                    <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 shadow-inner"><span className="text-4xl">👤</span></div>
                                )}
                            </div>

                            <div className="w-full space-y-3 px-4 text-center">
                                <h4 className="text-xl font-bold text-gray-800">{formData.nama}</h4>
                                <p className="text-sm text-gray-500">{formData.kode_driver}</p>

                                <div className="mt-4 pt-4 border-t w-full text-left space-y-2">
                                    <p className="flex justify-between text-sm"><span className="text-gray-500">Telp:</span> <span className="font-medium">{formData.nomor_telepon}</span></p>
                                    <p className="flex justify-between text-sm"><span className="text-gray-500">Lahir:</span> <span className="font-medium">{formData.tanggal_lahir}</span></p>
                                    <div className="flex justify-between text-sm items-center">
                                        <span className="text-gray-500">Status:</span>
                                        <span className={`font-bold px-2 py-0.5 rounded capitalize ${formData.status === 'berjalan' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{formData.status}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* TOMBOL */}
                    <div className="col-span-1 md:col-span-2 flex justify-end space-x-3 mt-4 pt-4 border-t">
                        <Link href="/drivers" className="bg-red-100 text-red-600 px-6 py-2 rounded-xl font-medium hover:bg-red-200">Batal</Link>
                        <button type="submit" disabled={loading} className="bg-teal-100 text-teal-700 px-6 py-2 rounded-xl font-medium hover:bg-teal-200">
                            {loading ? "Update..." : "Update Data"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}