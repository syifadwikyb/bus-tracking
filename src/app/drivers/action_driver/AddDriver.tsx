'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import Header from "@/components/Header";
import Swal from "sweetalert2";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AddDriver() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        kode_driver: "",
        nama: "",
        tanggal_lahir: "",
        nomor_telepon: "",
    });

    const [fotoFile, setFotoFile] = useState<File | null>(null);
    const [fotoPreview, setFotoPreview] = useState<string | null>(null);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert("Ukuran file terlalu besar! Maksimal 2MB.");
                e.target.value = "";
                return;
            }
            setFotoFile(file);
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

            payload.append("status", "berhenti");

            if (fotoFile) {
                payload.append("driver_foto", fotoFile);
            }

            const response = await fetch(`${API_URL}/api/drivers`, {
                method: "POST",
                body: payload,
            });

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.message || "Gagal menyimpan data driver");
            }

            Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: 'Sopir berhasil ditambahkan!',
                confirmButtonText: 'OK',
                confirmButtonColor: '#3B82F6'
            }).then((result) => {
                if (result.isConfirmed) {
                    router.push("/drivers");
                }
            });
        } catch (error: any) {
            console.error("❌ Gagal simpan:", error);
            Swal.fire({
                icon: 'error',
                title: 'Gagal Menyimpan',
                text: `Terjadi kesalahan: ${error.message}`,
                confirmButtonColor: '#EF4444',
                confirmButtonText: 'Tutup'
            });
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
            <Header subtitle={getGreeting()} title="Tambah Driver Baru" />

            <div className="p-6 bg-white rounded-2xl shadow-md">
                <p className="text-sm text-gray-500 mb-6" aria-label="breadcrumb">
                    <Link href="/drivers" className="hover:text-blue-600 hover:underline transition-colors">
                        Manajemen Driver
                    </Link>
                    <span className="mx-2">/</span>
                    <span className="font-medium text-gray-700">Tambah Driver</span>
                </p>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block font-medium mb-1">Kode Driver</label>
                            <input type="text" name="kode_driver" value={formData.kode_driver} onChange={handleChange} placeholder="Contoh: DRV-001" className="w-full border border-blue-400 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-400" required />
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Nama Lengkap</label>
                            <input type="text" name="nama" value={formData.nama} onChange={handleChange} placeholder="Nama Driver" className="w-full border border-blue-400 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-400" required />
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Tanggal Lahir</label>
                            <input type="date" name="tanggal_lahir" value={formData.tanggal_lahir} onChange={handleChange} className="w-full border border-blue-400 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-400" required />
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Nomor Telepon</label>
                            <input type="tel" name="nomor_telepon" value={formData.nomor_telepon} onChange={handleChange} placeholder="08xxxxxxxxxx" className="w-full border border-blue-400 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-400" required />
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Foto Driver</label>
                            <input type="file" accept="image/*" onChange={handleFileChange} className="w-full border border-blue-400 rounded-xl p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400" />
                            <p className="text-xs text-gray-400 mt-1">*Format: JPG, PNG. Maks 2MB.</p>
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="flex flex-col items-center border border-blue-300 rounded-xl p-6 h-full bg-gray-50">
                            <h3 className="text-lg font-semibold text-gray-700 mb-4">Preview Driver</h3>
                            
                            <div className="mb-4">
                                {fotoPreview ? (
                                    <img src={fotoPreview} alt="Preview" className="w-32 h-32 object-cover rounded-full shadow-md border-4 border-white" />
                                ) : (
                                    <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 shadow-inner">
                                        <span className="text-4xl"></span>
                                    </div>
                                )}
                            </div>

                            <div className="w-full space-y-3 px-4 text-center">
                                <h4 className="text-xl font-bold text-gray-800">{formData.nama || "Nama Driver"}</h4>
                                <p className="text-sm text-gray-500">{formData.kode_driver || "Kode Driver"}</p>

                                <div className="mt-4 pt-4 border-t w-full text-left space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 text-sm">No. Telp:</span>
                                        <span className="font-medium text-sm">{formData.nomor_telepon || "-"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 text-sm">Tgl Lahir:</span>
                                        <span className="font-medium text-sm">{formData.tanggal_lahir || "-"}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500 text-sm">Status Awal:</span>
                                        <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-xs font-bold">Berhenti</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-span-1 md:col-span-2 flex justify-end space-x-3 mt-4 pt-4 border-t">
                        <Link href="/drivers" className="bg-red-100 text-red-600 px-6 py-2 rounded-xl font-medium hover:bg-red-200">Batal</Link>
                        <button type="submit" disabled={loading} className={`px-6 py-2 rounded-xl font-medium text-teal-700 transition ${loading ? "bg-teal-50 cursor-not-allowed" : "bg-teal-100 hover:bg-teal-200"}`}>
                            {loading ? "Menyimpan..." : "Simpan Data"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}