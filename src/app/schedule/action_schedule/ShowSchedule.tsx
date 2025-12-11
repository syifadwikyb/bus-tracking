'use client';

import React, { useEffect, useState } from "react";
import { API_URL } from "@/lib/config";
import Link from 'next/link';
import Header from "@/components/Header";

export default function ShowSchedule({ id }: { id: string }) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDetail() {
            try {
                const res = await fetch(`${API_URL}/api/schedules/${id}`);
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
        <div className="">
            <Header subtitle="Detail Jadwal" title={`Detail Perjalanan: ${data.bus?.plat_nomor || '-'}`} />

            <div className="p-6 bg-white rounded-2xl shadow-lg max-w-3xl mx-auto mt-4">
                <div className="flex items-center gap-6 border-b pb-6">
                    <div className="w-32 h-32 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0">
                        {data.bus?.foto ? (
                            <img src={`${API_URL}/uploads/${data.bus.foto}`} alt="Bus" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Foto</div>
                        )}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">{data.bus?.plat_nomor}</h2>
                        <p className="text-gray-500">Status Bus: {data.bus?.status}</p>
                        <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold 
                            ${data.status === 'berjalan' ? 'bg-blue-100 text-blue-700' :
                                data.status === 'selesai' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                            {data.status?.toUpperCase()}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-gray-500">Driver</p>
                            <p className="font-medium text-lg">{data.driver?.nama || '-'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Jalur / Rute</p>
                            <p className="font-medium text-lg">{data.jalur?.nama_jalur || '-'}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-gray-500">Tanggal Keberangkatan</p>
                            <p className="font-medium text-lg">
                                {data.tanggal ? new Date(data.tanggal).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '-'}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Waktu Operasional</p>
                            <p className="font-medium text-lg text-teal-700">
                                {data.jam_mulai} <span className="text-gray-400 mx-2">s/d</span> {data.jam_selesai}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t flex justify-end">
                    <Link href="/schedule" className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition">
                        Kembali
                    </Link>
                </div>
            </div>
        </div>
    );
}