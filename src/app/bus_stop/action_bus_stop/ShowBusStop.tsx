'use client';

import React, { useEffect, useState } from "react";
import { API_URL } from "@/lib/config";
import Link from 'next/link';
import Header from "@/components/Header";
import dynamic from 'next/dynamic';

const BusStopMap = dynamic(() => import('../components/BusStopMap'), { ssr: false });

export default function ShowBusStop({ id }: { id: string }) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDetail() {
            try {
                const res = await fetch(`${API_URL}/api/halte/${id}`);
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
            <Header subtitle="Detail Halte" title={`Lokasi: ${data.nama_halte}`} />

            <div className="p-6 bg-white rounded-2xl shadow-lg mt-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <p className="text-sm text-gray-500">Nama Halte</p>
                            <p className="text-xl font-bold text-gray-800">{data.nama_halte}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <p className="text-sm text-gray-500">Koordinat</p>
                            <p className="font-mono text-sm text-gray-700">{data.latitude}, {data.longitude}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Urutan</p>
                                <p className="text-lg font-bold">Ke-{data.urutan}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500">ID Halte</p>
                                <p className="text-lg font-bold">#{data.id_halte}</p>
                            </div>
                        </div>
                        <div className="pt-4">
                            <Link href="/bus_stop" className="block w-full text-center py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-medium">
                                Kembali
                            </Link>
                        </div>
                    </div>

                    {/* Static Map */}
                    <div className="lg:col-span-2 h-[400px] border border-gray-300 rounded-xl overflow-hidden relative">
                        <BusStopMap
                            position={{ lat: parseFloat(data.latitude), lng: parseFloat(data.longitude) }}
                            readOnly={true}
                        />
                        <div className="absolute bottom-2 right-2 bg-white/80 px-2 py-1 rounded text-xs z-[1000]">
                            Mode: Read Only
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}