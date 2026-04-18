'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import Header from "@/components/Header";
import dynamic from 'next/dynamic';
import Swal from "sweetalert2";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const BusStopMap = dynamic(() => import('../components/BusStopMap'), { ssr: false });

export default function EditBusStop({ id }: { id: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [jalurs, setJalurs] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        nama_halte: "",
        jalur_id: "",
        urutan: "",
        latitude: "",
        longitude: "",
    });

    useEffect(() => {
        async function fetchData() {
            try {
                const resHalte = await fetch(`${API_URL}/api/halte/${id}`);
                const dataHalte = await resHalte.json();
                const halte = dataHalte.data || dataHalte;

                const resJalur = await fetch(`${API_URL}/api/jalur`);
                const dataJalur = await resJalur.json();
                setJalurs(Array.isArray(dataJalur) ? dataJalur : (dataJalur.data || []));

                setFormData({
                    nama_halte: halte.nama_halte || "",
                    jalur_id: halte.jalur_id?.toString() || "",
                    urutan: halte.urutan?.toString() || "",
                    latitude: halte.latitude?.toString() || "",
                    longitude: halte.longitude?.toString() || "",
                });

            } catch (error) {
                console.error(error);
                alert("Gagal memuat data");
            } finally {
                setLoadingData(false);
            }
        }
        if (id) fetchData();
    }, [id]);

    const handleMapSelect = (pos: { lat: number; lng: number }) => {
        setFormData(prev => ({ ...prev, latitude: pos.lat.toString(), longitude: pos.lng.toString() }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                nama_halte: formData.nama_halte,
                jalur_id: Number(formData.jalur_id),
                urutan: Number(formData.urutan),
                latitude: parseFloat(formData.latitude),
                longitude: parseFloat(formData.longitude),
            };

            const response = await fetch(`${API_URL}/api/halte/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Gagal update data");
            }

            Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: 'Data bus berhasil diperbarui!',
                confirmButtonText: 'OK',
                confirmButtonColor: '#3B82F6'
            }).then((result) => {
                if (result.isConfirmed) {
                    router.push("/bus_stop");
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

    if (loadingData) return <div className="p-10 text-center">Memuat data...</div>;

    return (
        <div className="">
            <Header subtitle="Edit Halte" title="Perbarui Data Halte" />
            <div className="p-6 bg-white rounded-2xl shadow-md">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 space-y-4">
                        <div>
                            <label className="block font-medium mb-1">Nama Halte</label>
                            <input type="text" name="nama_halte" value={formData.nama_halte} onChange={handleChange} className="w-full border border-blue-400 rounded-xl p-2" required />
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Jalur</label>
                            <select name="jalur_id" value={formData.jalur_id} onChange={handleChange} className="w-full border border-blue-400 rounded-xl p-2" required>
                                <option value="">-- Pilih Jalur --</option>
                                {jalurs.map((j) => (
                                    <option key={j.id_jalur} value={j.id_jalur}>{j.nama_jalur}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Urutan</label>
                            <input type="number" name="urutan" value={formData.urutan} onChange={handleChange} className="w-full border border-blue-400 rounded-xl p-2" required />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <input type="text" value={formData.latitude} className="w-full border p-2 bg-gray-100 rounded text-sm" readOnly />
                            <input type="text" value={formData.longitude} className="w-full border p-2 bg-gray-100 rounded text-sm" readOnly />
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                            <Link href="/bus_stop" className="px-4 py-2 bg-red-100 text-red-600 rounded-lg">Batal</Link>
                            <button type="submit" disabled={loading} className="px-4 py-2 bg-teal-100 text-teal-700 rounded-lg font-medium hover:bg-teal-200">
                                {loading ? "Update..." : "Update Halte"}
                            </button>
                        </div>
                    </div>

                    <div className="lg:col-span-2 h-[500px] border border-gray-300 rounded-xl overflow-hidden relative">
                        <BusStopMap
                            position={formData.latitude ? { lat: parseFloat(formData.latitude), lng: parseFloat(formData.longitude) } : null}
                            setPosition={handleMapSelect}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}