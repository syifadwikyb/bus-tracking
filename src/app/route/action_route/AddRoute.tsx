'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import Header from "@/components/Header";
import dynamic from 'next/dynamic';
import Swal from "sweetalert2";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const RouteMap = dynamic(() => import('../components/RouteMap'), { ssr: false });

export default function AddRoute() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        kode_jalur: "",
        nama_jalur: "",
        status: "aktif",
    });

    const [points, setPoints] = useState<[number, number][]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleResetMap = () => {
        setPoints([]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (points.length < 2) {
            Swal.fire({
                icon: 'warning',
                title: 'Jalur Kosong!',
                text: 'Harap buat jalur di peta minimal 2 titik!',
                confirmButtonText: 'OK',
                confirmButtonColor: '#3B82F6'
            });
            return;
        }

        setLoading(true);

        try {
            const polylineString = JSON.stringify(points);

            const payload = {
                kode_jalur: formData.kode_jalur,
                nama_jalur: formData.nama_jalur,
                status: formData.status === 'aktif' ? 'berjalan' : 'berhenti',
                rute_polyline: polylineString,
            };

            console.log("🚀 Sending Payload:", payload);

            const response = await fetch(`${API_URL}/api/jalur`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const result = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(result?.message || `Gagal menyimpan rute (${response.status})`);
            }

            Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: 'Rute berhasil diperbarui!',
                confirmButtonText: 'OK',
                confirmButtonColor: '#3B82F6'
            }).then((result) => {
                if (result.isConfirmed) {
                    router.push("/route");
                }
            });
        } catch (error: any) {
            console.error(error);
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
    };

    return (
        <div className="p-8">
            <Header subtitle="Manajemen Rute" title="Tambah Rute Baru" />

            <div className="p-6 bg-white rounded-2xl shadow-md">
                <p className="text-sm text-gray-500 mb-6">
                    <Link href="/route" className="hover:text-blue-600 hover:underline">List Rute</Link>
                    <span className="mx-2">/</span>
                    <span className="font-medium text-gray-700">Tambah Rute</span>
                </p>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    <div className="lg:col-span-1 space-y-4">
                        <div>
                            <label className="block font-medium mb-1">Kode Jalur</label>
                            <input type="text" name="kode_jalur" value={formData.kode_jalur} onChange={handleChange} className="w-full border border-blue-400 rounded-xl p-2" required placeholder="Contoh: RUTE-A1" />
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Nama Jalur</label>
                            <input type="text" name="nama_jalur" value={formData.nama_jalur} onChange={handleChange} className="w-full border border-blue-400 rounded-xl p-2" required placeholder="Contoh: Pasar - Terminal" />
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Status</label>
                            <select name="status" value={formData.status} onChange={handleChange} className="w-full border border-blue-400 rounded-xl p-2">
                                <option value="aktif">Aktif</option>
                                <option value="tidak aktif">Tidak Aktif</option>
                            </select>
                        </div>

                        <div className="pt-4 border-t">
                            <p className="text-sm text-gray-500 mb-2">Instruksi Peta:</p>
                            <ul className="text-xs text-gray-400 list-disc ml-4 mb-4">
                                <li>Klik pada peta untuk menambahkan titik.</li>
                                <li>Hubungkan titik untuk membentuk jalur.</li>
                                <li>Minimal 2 titik diperlukan.</li>
                            </ul>
                            <button type="button" onClick={handleResetMap} className="w-full py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 text-sm mb-2">
                                ↺ Reset Gambar Peta
                            </button>
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Link href="/route" className="px-4 py-2 bg-red-100 text-red-600 rounded-lg">Batal</Link>
                            <button type="submit" disabled={loading} className="px-4 py-2 bg-teal-100 text-teal-700 rounded-lg font-medium hover:bg-teal-200">
                                {loading ? "Menyimpan..." : "Simpan Rute"}
                            </button>
                        </div>
                    </div>

                    <div className="lg:col-span-2 h-[500px] border border-gray-300 rounded-xl overflow-hidden relative shadow-inner">
                        <RouteMap points={points} setPoints={setPoints} />

                        <div className="absolute top-2 right-2 bg-white px-3 py-1 rounded-md shadow z-[1000] text-xs font-bold text-gray-700">
                            Total Titik: {points.length}
                        </div>

                        {points.length === 0 && (
                            <div className="absolute inset-0 bg-black/10 flex items-center justify-center z-[1000] pointer-events-none">
                                <div className="bg-white/90 px-4 py-2 rounded-full shadow-lg text-sm font-bold text-gray-700 animate-bounce">
                                    👆 Silakan Klik Peta untuk Memulai Titik Rute
                                </div>
                            </div>
                        )}
                    </div>

                </form>
            </div>
        </div>
    );
}