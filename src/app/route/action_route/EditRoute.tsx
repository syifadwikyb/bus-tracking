'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import Header from "@/components/Header";
import dynamic from 'next/dynamic';
import Swal from "sweetalert2";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const RouteMap = dynamic(() => import('../components/RouteMap'), { ssr: false });

export default function EditRoute({ id }: { id: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        kode_jalur: "",
        nama_jalur: "",
        status: "aktif", // Default dropdown
    });

    const [points, setPoints] = useState<[number, number][]>([]);

    // --- FETCH DATA ---
    useEffect(() => {
        async function fetchRoute() {
            if (!id) return;
            console.log(`📡 Fetching Route ID: ${id}`); // Debugging

            try {
                const res = await fetch(`${API_URL}/api/jalur/${id}`);

                if (!res.ok) {
                    const errText = await res.text();
                    throw new Error(`Gagal fetch data (Server ${res.status}): ${errText}`);
                }

                const json = await res.json();
                const data = json.data || json; // Handle wrapper { data: ... } atau raw object

                console.log("📦 Data Route Diterima:", data);

                // Mapping Status Backend -> Frontend
                // Backend: 'berjalan'/'berhenti'
                // Frontend: 'aktif'/'tidak aktif'
                let statusFrontend = "aktif";
                if (data.status === 'berhenti') statusFrontend = "tidak aktif";

                setFormData({
                    kode_jalur: data.kode_jalur || "",
                    nama_jalur: data.nama_jalur || "",
                    status: statusFrontend,
                });

                // Parse Polyline String ke Array
                if (data.rute_polyline && typeof data.rute_polyline === 'string') {
                    try {
                        const parsedPoints = JSON.parse(data.rute_polyline);
                        if (Array.isArray(parsedPoints)) {
                            setPoints(parsedPoints);
                        }
                    } catch (e) {
                        console.error("⚠️ Gagal parsing polyline (mungkin format salah):", e);
                    }
                }
            } catch (error: any) {
                console.error(error);
                Swal.fire({
                    icon: 'error',
                    title: 'Tidak Ditemukan',
                    text: 'Jalur tidak ditemukan atau terjadi kesalahan.',
                    confirmButtonColor: '#EF4444',
                    confirmButtonText: 'Kembali'
                }).then(() => {
                    router.push("/route");
                });
            } finally {
                setLoadingData(false);
            }
        }
        fetchRoute();
    }, [id]);

    // --- SUBMIT DATA ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (points.length < 2) {
            alert("⚠️ Harap buat jalur di peta minimal 2 titik!");
            return;
        }

        setLoading(true);

        try {
            // Mapping Status Frontend -> Backend
            const statusBackend = formData.status === 'aktif' ? 'berjalan' : 'berhenti';

            const payload = {
                kode_jalur: formData.kode_jalur,
                nama_jalur: formData.nama_jalur,
                status: statusBackend,
                rute_polyline: JSON.stringify(points),
            };

            const res = await fetch(`${API_URL}/api/jalur/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.message || "Gagal update rute");
            }

            Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: 'Jalur berhasil diperbarui!',
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

    if (loadingData) return <div className="p-10 text-center">Memuat data rute...</div>;

    // Tampilan Error jika ID tidak ditemukan / Server Error
    if (error) return (
        <div className="p-10 text-center">
            <div className="text-red-500 mb-4">Error: {error}</div>
            <Link href="/route" className="text-blue-600 underline">Kembali ke Daftar Rute</Link>
        </div>
    );

    return (
        <div className="">
            <Header subtitle="Edit Rute" title="Perbarui Data Jalur" />

            <div className="p-6 bg-white rounded-2xl shadow-md">
                <p className="text-sm text-gray-500 mb-6">
                    <Link href="/route" className="hover:text-blue-600 hover:underline">List Rute</Link>
                    <span className="mx-2">/</span>
                    <span className="font-medium text-gray-700">Edit Rute</span>
                </p>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* INPUT FORM */}
                    <div className="lg:col-span-1 space-y-4">
                        <div>
                            <label className="block font-medium mb-1">Kode Jalur</label>
                            <input type="text" value={formData.kode_jalur} onChange={(e) => setFormData({ ...formData, kode_jalur: e.target.value })} className="w-full border border-blue-400 rounded-xl p-2" required />
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Nama Jalur</label>
                            <input type="text" value={formData.nama_jalur} onChange={(e) => setFormData({ ...formData, nama_jalur: e.target.value })} className="w-full border border-blue-400 rounded-xl p-2" required />
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Status</label>
                            <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full border border-blue-400 rounded-xl p-2">
                                <option value="aktif">Aktif</option>
                                <option value="tidak aktif">Tidak Aktif</option>
                            </select>
                        </div>

                        <div className="pt-4 border-t">
                            <button type="button" onClick={() => setPoints([])} className="w-full py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 text-sm mt-2 transition">
                                ↺ Reset / Hapus Jalur Peta
                            </button>
                        </div>

                        <div className="flex justify-end gap-2 pt-4 border-t mt-4">
                            <Link href="/route" className="px-4 py-2 bg-red-100 text-red-600 rounded-lg font-medium hover:bg-red-200">Batal</Link>
                            <button type="submit" disabled={loading} className="px-4 py-2 bg-teal-100 text-teal-700 rounded-lg font-medium hover:bg-teal-200">
                                {loading ? "Update..." : "Update Rute"}
                            </button>
                        </div>
                    </div>

                    {/* MAP */}
                    <div className="lg:col-span-2 h-[500px] border border-gray-300 rounded-xl overflow-hidden relative">
                        <RouteMap points={points} setPoints={setPoints} />
                        <div className="absolute top-2 right-2 bg-white/90 px-3 py-1 rounded-md shadow z-[1000] text-xs font-bold">
                            Total Titik: {points.length}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}