'use client';

import React, { useEffect, useState } from "react";
import { API_URL } from "@/lib/config";
import Link from 'next/link';
import Header from "@/components/Header";

export default function ShowBus({ id }: { id: string }) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDetail() {
            try {
                const res = await fetch(`${API_URL}/api/bus/${id}`);

                // Cek error jika response bukan JSON (misal 404 HTML)
                if (!res.ok) throw new Error("Gagal mengambil data");

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
            <Header subtitle="Detail Data" title={`Detail Bus: ${data.plat_nomor}`} />

            <div className="p-6 bg-white rounded-2xl shadow-lg max-w-3xl mx-auto mt-4">
                <div className="flex items-center gap-6 border-b pb-6">
                    {/* FOTO BUS */}
                    <div className="w-32 h-32 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 border border-gray-200 shadow-sm">
                        {data.foto ? (
                            <img
                                src={`${API_URL}/uploads/${data.foto}`}
                                alt="Foto Bus"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                                <span className="text-2xl">🚌</span>
                                <span className="text-xs mt-1">No Foto</span>
                            </div>
                        )}
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">{data.plat_nomor}</h2>
                        <p className="text-gray-500 font-medium">{data.kode_bus}</p>
                        <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold 
                            ${data.status === 'berjalan' ? 'bg-green-100 text-green-700' :
                                data.status === 'dijadwalkan' ? 'bg-blue-100 text-blue-700' :
                                    data.status === 'dalam perbaikan' ? 'bg-gray-200 text-gray-700' :
                                        'bg-orange-100 text-orange-700'}`}>
                            {data.status?.toUpperCase()}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-gray-500">Jenis Bus</p>
                            <p className="font-medium text-lg text-gray-800">{data.jenis_bus || '-'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Kapasitas Penumpang</p>
                            <p className="font-medium text-lg text-gray-800">{data.kapasitas} Kursi</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-gray-500">Terakhir Diupdate</p>
                            <p className="font-medium text-lg text-gray-800">
                                {data.updated_at ? new Date(data.updated_at).toLocaleDateString('id-ID', {
                                    day: 'numeric', month: 'long', year: 'numeric'
                                }) : '-'}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">ID Sistem</p>
                            <p className="font-medium text-lg text-gray-400">#{data.id_bus}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t flex justify-end">
                    <Link href="/bus" className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition">
                        Kembali
                    </Link>
                </div>
            </div>
        </div>
    );
}