'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/config";
import Link from 'next/link';
import Header from "@/components/Header";

export default function AddBus() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // State untuk text input
    const [formData, setFormData] = useState({
        kode_bus: "",
        plat_nomor: "",
        kapasitas: "",
        jenis_bus: "",
    });

    // State khusus untuk File Foto
    const [fotoFile, setFotoFile] = useState<File | null>(null);
    const [fotoPreview, setFotoPreview] = useState<string | null>(null);

    // Handle Perubahan Text Input
    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Handle Upload File & Preview
    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            // Validasi ukuran (opsional, misal max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                alert("Ukuran file terlalu besar! Maksimal 2MB.");
                e.target.value = ""; // Reset input
                return;
            }
            setFotoFile(file);
            setFotoPreview(URL.createObjectURL(file)); // Buat URL lokal untuk preview
        }
    }

    // Submit Form
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        // 🔍 DEBUG: Cek URL yang ditembak
        console.log("🚀 Mengirim ke:", `${API_URL}/api/bus`);

        try {
            const payload = new FormData();
            payload.append("kode_bus", formData.kode_bus);
            payload.append("plat_nomor", formData.plat_nomor);
            payload.append("kapasitas", formData.kapasitas);
            payload.append("jenis_bus", formData.jenis_bus);
            payload.append("status", "berhenti"); // Default status

            if (fotoFile) {
                payload.append("foto", fotoFile);
            }

            const response = await fetch(`${API_URL}/api/bus`, {
                method: "POST",
                body: payload,
                // ⚠️ JANGAN PAKAI HEADERS 'Content-Type' SAAT UPLOAD FILE
            });

            // 🛑 Cek Response SEBELUM parse JSON
            const responseText = await response.text(); // Ambil response sebagai text dulu

            console.log("📦 Response Server:", responseText); // Lihat isi aslinya di Console

            if (!response.ok) {
                // Coba parse JSON jika bisa, jika tidak pakai text asli
                try {
                    const errorJson = JSON.parse(responseText);
                    throw new Error(errorJson.message || "Gagal menyimpan data");
                } catch {
                    // Jika gagal parse JSON, berarti errornya HTML
                    throw new Error(`Server Error (${response.status}): Cek Console untuk detail.`);
                }
            }

            // Jika sukses, baru parse JSON (opsional, karena kita sudah yakin sukses)
            // const result = JSON.parse(responseText); 

            alert("✅ Data Bus berhasil ditambahkan!");
            router.push("/bus");

        } catch (error: any) {
            console.error("❌ Gagal simpan:", error);
            alert(`❌ Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    }

    function getGreeting() {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 11) return "Selamat Pagi Admin!";
        if (hour >= 11 && hour < 15) return "Selamat Siang Admin!";
        if (hour >= 15 && hour < 18) return "Selamat Sore Admin!";
        return "Selamat Malam Admin!";
    }

    return (
        <div className="p-8">
            <Header subtitle={getGreeting()} title="Tambah Data Bus" />

            <div className="p-6 bg-white rounded-2xl shadow-md">
                {/* Breadcrumb */}
                <p className="text-sm text-gray-500 mb-6" aria-label="breadcrumb">
                    <Link href="/bus" className="hover:text-blue-600 hover:underline transition-colors">
                        Manajemen Bus
                    </Link>
                    <span className="mx-2">/</span>
                    <span className="font-medium text-gray-700">Tambah Bus</span>
                </p>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* --- KOLOM KIRI (Form Input) --- */}
                    <div className="space-y-4">
                        {/* Kode Bus */}
                        <div>
                            <label className="block font-medium mb-1">Kode Bus</label>
                            <input
                                type="text"
                                name="kode_bus"
                                value={formData.kode_bus}
                                onChange={handleChange}
                                placeholder="Contoh: BUS-001"
                                className="w-full border border-blue-400 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                required
                            />
                        </div>

                        {/* Plat Nomor */}
                        <div>
                            <label className="block font-medium mb-1">Plat Nomor</label>
                            <input
                                type="text"
                                name="plat_nomor"
                                value={formData.plat_nomor}
                                onChange={handleChange}
                                placeholder="Contoh: B 1234 CD"
                                className="w-full border border-blue-400 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                required
                            />
                        </div>

                        {/* Jenis Bus */}
                        <div>
                            <label className="block font-medium mb-1">Jenis Bus</label>
                            <input
                                type="text"
                                name="jenis_bus"
                                value={formData.jenis_bus}
                                onChange={handleChange}
                                placeholder="Contoh: Pariwisata / AKAP"
                                className="w-full border border-blue-400 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                required
                            />
                        </div>

                        {/* Kapasitas */}
                        <div>
                            <label className="block font-medium mb-1">Kapasitas (Kursi)</label>
                            <input
                                type="number"
                                name="kapasitas"
                                value={formData.kapasitas}
                                onChange={handleChange}
                                placeholder="Contoh: 50"
                                className="w-full border border-blue-400 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                required
                            />
                        </div>

                        {/* Upload Foto */}
                        <div>
                            <label className="block font-medium mb-1">Foto Bus</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="w-full border border-blue-400 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                            />
                            <p className="text-xs text-gray-400 mt-1">*Format: JPG, PNG, JPEG. Maks 2MB.</p>
                        </div>
                    </div>

                    {/* --- KOLOM KANAN (Live Preview) --- */}
                    <div className="space-y-4">
                        <div className="flex flex-col items-center border border-blue-300 rounded-xl p-6 h-full bg-gray-50">

                            <h3 className="text-lg font-semibold text-gray-700 mb-4">Preview Data Bus</h3>

                            {/* Preview Foto / Placeholder */}
                            <div className="mb-4 w-full flex justify-center">
                                {fotoPreview ? (
                                    <img
                                        src={fotoPreview}
                                        alt="Preview Bus"
                                        className="w-64 h-40 object-cover rounded-lg shadow-sm border border-gray-200"
                                    />
                                ) : (
                                    <div className="w-64 h-40 bg-teal-50 flex flex-col items-center justify-center rounded-lg text-teal-600 shadow-inner border border-teal-100">
                                        <span className="text-4xl mb-2">🚌</span>
                                        <span className="text-sm font-medium">Foto Belum Dipilih</span>
                                    </div>
                                )}
                            </div>

                            {/* Info Detail Preview */}
                            <div className="w-full space-y-3 px-4">
                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-gray-500">Plat Nomor:</span>
                                    <span className="font-medium text-gray-800">
                                        {formData.plat_nomor || "-"}
                                    </span>
                                </div>
                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-gray-500">Kode:</span>
                                    <span className="font-medium text-gray-800">
                                        {formData.kode_bus || "-"}
                                    </span>
                                </div>
                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-gray-500">Jenis:</span>
                                    <span className="font-medium text-gray-800">
                                        {formData.jenis_bus || "-"}
                                    </span>
                                </div>
                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-gray-500">Kapasitas:</span>
                                    <span className="font-medium text-gray-800">
                                        {formData.kapasitas ? `${formData.kapasitas} Kursi` : "-"}
                                    </span>
                                </div>

                                {/* Status Default (Hardcoded Preview) */}
                                <div className="flex justify-between pt-2">
                                    <span className="text-gray-500">Status Awal:</span>
                                    <span className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded text-sm font-bold capitalize">
                                        Berhenti (Default)
                                    </span>
                                </div>
                                <p className="text-xs text-center text-gray-400 mt-2">
                                    *Status akan berubah otomatis saat ada jadwal atau maintenance.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* --- TOMBOL AKSI --- */}
                    <div className="col-span-1 md:col-span-2 flex justify-end space-x-3 mt-4 pt-4 border-t">
                        <Link href="/bus" className="bg-red-100 text-red-600 px-6 py-2 rounded-xl font-medium hover:bg-red-200 transition">
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-6 py-2 rounded-xl font-medium text-teal-700 transition ${loading
                                ? "bg-teal-50 cursor-not-allowed"
                                : "bg-teal-100 hover:bg-teal-200"
                                }`}
                        >
                            {loading ? "Menyimpan..." : "Simpan Data"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}