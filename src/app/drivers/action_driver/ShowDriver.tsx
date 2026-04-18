'use client';

import React, { useEffect, useState } from "react";
import Link from 'next/link';
import Header from "@/components/Header";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ShowDriver({ id }: { id: string }) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDetail() {
            try {
                const res = await fetch(`${API_URL}/api/drivers/${id}`);
                const json = await res.json();
                setData(json.data || json);
            } catch (error) {
                console.error("Gagal ambil detail:", error);
            } finally {
                setLoading(false);
            }
        }
        if (id) fetchDetail();
    }, [id]);

    if (loading) return <div className="p-10 text-center">Memuat detail...</div>;
    if (!data) return <div className="p-10 text-center">Data tidak ditemukan</div>;

    return (
        <div className="p-8">
            <Header subtitle="Detail Data" title={`Profil: ${data.nama}`} />

            <div className="p-6 bg-white rounded-2xl shadow-lg max-w-3xl mx-auto mt-4">
                <div className="flex flex-col md:flex-row items-center gap-8 border-b pb-8">
                    {/* FOTO PROFIL */}
                    <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-teal-50 shadow-lg flex-shrink-0">
                        {data.driver_foto ? (
                            <img src={`${API_URL}/uploads/${data.driver_foto}`} alt="Foto Driver" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-4xl">👤</div>
                        )}
                    </div>

                    <div className="text-center md:text-left flex-1">
                        <h2 className="text-3xl font-bold text-gray-800">{data.nama}</h2>
                        <p className="text-gray-500 text-lg mb-2">{data.kode_driver}</p>
                        <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide uppercase
    ${data.status?.toLowerCase() === 'berjalan' ? 'bg-green-100 text-green-700' :
                                data.status?.toLowerCase() === 'dijadwalkan' ? 'bg-blue-100 text-blue-700' :
                                    'bg-orange-100 text-orange-700'}`}>
                            {data.status || 'TIDAK ADA STATUS'}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                    <div className="space-y-1">
                        <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Nomor Telepon</p>
                        <p className="text-lg font-medium text-gray-800">{data.nomor_telepon}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Tanggal Lahir</p>
                        <p className="text-lg font-medium text-gray-800">
                            {data.tanggal_lahir ? new Date(data.tanggal_lahir).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                        </p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">ID Sistem</p>
                        <p className="text-lg font-medium text-gray-400">#{data.id_driver}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Bergabung Sejak</p>
                        <p className="text-lg font-medium text-gray-800">
                            {data.created_at ? new Date(data.created_at).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }) : '-'}
                        </p>
                    </div>
                </div>

                <div className="mt-10 pt-6 border-t flex justify-end">
                    <Link href="/drivers" className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition">
                        Kembali
                    </Link>
                </div>
            </div>
        </div>
    );
}