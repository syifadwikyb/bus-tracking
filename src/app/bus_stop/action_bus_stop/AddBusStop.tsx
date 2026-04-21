'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import Header from "@/components/Header";
import dynamic from 'next/dynamic';
import Swal from "sweetalert2";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const BusStopMap = dynamic(() => import('../components/BusStopMap'), { ssr: false });

interface Jalur {
    id_jalur: number;
    nama_jalur: string;
    status: string;
}

export default function AddBusStop() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [loadingJalur, setLoadingJalur] = useState(true);
    const [jalurs, setJalurs] = useState<Jalur[]>([]);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        nama_halte: "",
        jalur_id: "",
        urutan: "",
        latitude: "",
        longitude: "",
    });

    useEffect(() => {
        const fetchJalur = async () => {
            try {
                const res = await fetch(`${API_URL}/api/jalur`);
                if (!res.ok) throw new Error("Gagal fetch jalur");
                const data = await res.json();

                const allJalurs = Array.isArray(data) ? data : (data.data || []);

                const activeJalurs = allJalurs.filter((j: Jalur) =>
                    j.status.toLowerCase() === 'berjalan' || j.status.toLowerCase() === 'aktif'
                );

                setJalurs(activeJalurs);
            } catch (error: any) {
                console.error("Error:", error);
                setErrorMsg("Gagal memuat data jalur.");
            } finally {
                setLoadingJalur(false);
            }
        };
        fetchJalur();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleMapSelect = (pos: { lat: number; lng: number }) => {
        setFormData(prev => ({
            ...prev,
            latitude: pos.lat.toString(),
            longitude: pos.lng.toString()
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.latitude || !formData.longitude) {
            Swal.fire({
                icon: 'warning',
                title: 'Lokasi Belum Dipilih!',
                text: 'Harap KLIK PETA untuk menentukan lokasi Halte!',
                confirmButtonText: 'OK',
                confirmButtonColor: '#3B82F6'
            });
            return;
        }

        if (!formData.jalur_id) {
            Swal.fire({
                icon: 'warning',
                title: 'Jalur Kosong!',
                text: 'Harap pilih Jalur untuk halte ini!',
                confirmButtonText: 'OK',
                confirmButtonColor: '#3B82F6'
            });
            return;
        }

        if (!formData.urutan) {
            Swal.fire({
                icon: 'warning',
                title: 'Urutan Kosong!',
                text: 'Harap isi Urutan Halte pada jalur tersebut!',
                confirmButtonText: 'OK',
                confirmButtonColor: '#3B82F6'
            });
            return;
        }

        setLoading(true);

        try {
            const payload = {
                nama_halte: formData.nama_halte,
                jalur_id: Number(formData.jalur_id),
                urutan: Number(formData.urutan),
                latitude: parseFloat(formData.latitude),
                longitude: parseFloat(formData.longitude),
            };

            console.log("📤 Mengirim Payload:", payload);

            const response = await fetch(`${API_URL}/api/halte`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const result = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(result.message || `Gagal menyimpan (${response.status})`);
            }

            Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: 'Data bus berhasil ditambahkan!',
                confirmButtonText: 'OK',
                confirmButtonColor: '#3B82F6'
            }).then((result) => {
                if (result.isConfirmed) {
                    router.push("/bus_stop");
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
    };

    return (
        <div className="">
            <Header subtitle="Manajemen Halte" title="Tambah Halte Baru" />

            <div className="p-6 bg-white rounded-2xl shadow-md">
                <p className="text-sm text-gray-500 mb-6">
                    <Link href="/bus_stop" className="hover:text-blue-600 hover:underline">List Halte</Link>
                    <span className="mx-2">/</span>
                    <span className="font-medium text-gray-700">Tambah Halte</span>
                </p>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    <div className="lg:col-span-1 space-y-4">
                        <div>
                            <label className="block font-medium mb-1">Nama Halte</label>
                            <input type="text" name="nama_halte" value={formData.nama_halte} onChange={handleChange} className="w-full border border-blue-400 rounded-xl p-2" required placeholder="Contoh: Halte Simpang Lima" />
                        </div>

                        <div>
                            <label className="block font-medium mb-1">Pilih Jalur</label>
                            {errorMsg && <p className="text-xs text-red-500 mb-1">{errorMsg}</p>}
                            <select
                                name="jalur_id"
                                value={formData.jalur_id}
                                onChange={handleChange}
                                className="w-full border border-blue-400 rounded-xl p-2 bg-white"
                                required
                                disabled={loadingJalur}
                            >
                                <option value="">
                                    {loadingJalur ? "Memuat data jalur..." : "-- Pilih Jalur --"}
                                </option>
                                {jalurs.map((j) => (
                                    <option key={j.id_jalur} value={j.id_jalur}>{j.nama_jalur}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block font-medium mb-1">Urutan Halte</label>
                            <input type="number" name="urutan" value={formData.urutan} onChange={handleChange} className="w-full border border-blue-400 rounded-xl p-2" required placeholder="Urutan ke-" />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block font-medium mb-1 text-sm">Latitude</label>
                                <input type="text" value={formData.latitude} className="w-full border border-gray-300 rounded-xl p-2 bg-gray-100 text-sm cursor-not-allowed" readOnly placeholder="Klik Peta →" />
                            </div>
                            <div>
                                <label className="block font-medium mb-1 text-sm">Longitude</label>
                                <input type="text" value={formData.longitude} className="w-full border border-gray-300 rounded-xl p-2 bg-gray-100 text-sm cursor-not-allowed" readOnly placeholder="Klik Peta →" />
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Link href="/bus_stop" className="px-4 py-2 bg-red-100 text-red-600 rounded-lg">Batal</Link>
                            <button type="submit" disabled={loading} className="px-4 py-2 bg-teal-100 text-teal-700 rounded-lg font-medium hover:bg-teal-200">
                                {loading ? "Menyimpan..." : "Simpan Halte"}
                            </button>
                        </div>
                    </div>

                    <div className="lg:col-span-2 h-[500px] border border-gray-300 rounded-xl overflow-hidden relative shadow-inner">
                        <BusStopMap
                            position={formData.latitude ? { lat: parseFloat(formData.latitude), lng: parseFloat(formData.longitude) } : null}
                            setPosition={handleMapSelect}
                        />

                        {!formData.latitude && (
                            <div className="absolute inset-0 bg-black/10 flex items-center justify-center z-[1000] pointer-events-none">
                                <div className="bg-white/90 px-4 py-2 rounded-full shadow-lg text-sm font-bold text-gray-700 animate-bounce">
                                    👆 Silakan Klik Peta untuk Lokasi Halte
                                </div>
                            </div>
                        )}
                    </div>

                </form>
            </div>
        </div>
    );
}