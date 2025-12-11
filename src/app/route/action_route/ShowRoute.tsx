'use client';

import React, { useEffect, useState } from "react";
import { API_URL } from "@/lib/config";
import Link from 'next/link';
import Header from "@/components/Header";
import dynamic from 'next/dynamic';

const RouteMap = dynamic(() => import('../components/RouteMap'), { ssr: false });

export default function ShowRoute({ id }: { id: string }) {
    const [data, setData] = useState<any>(null);
    const [points, setPoints] = useState<[number, number][]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch(`${API_URL}/api/jalur/${id}`);
                const json = await res.json();
                const routeData = json.data || json;
                setData(routeData);

                if (routeData.rute_polyline) {
                    setPoints(JSON.parse(routeData.rute_polyline));
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        if (id) fetchData();
    }, [id]);

    if (loading) return <div className="p-10 text-center">Memuat detail...</div>;
    if (!data) return <div className="p-10 text-center">Data tidak ditemukan</div>;

    return (
        <div className="p-8">
            <Header subtitle="Detail Rute" title={`Jalur: ${data.nama_jalur}`} />

            <div className="p-6 bg-white rounded-2xl shadow-lg mt-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Info Text */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <p className="text-sm text-gray-500">Kode Jalur</p>
                            <p className="text-xl font-bold text-gray-800">{data.kode_jalur}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <p className="text-sm text-gray-500">Nama Jalur</p>
                            <p className="text-xl font-bold text-gray-800">{data.nama_jalur}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <p className="text-sm text-gray-500">Status</p>
                            <span className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-bold capitalize
                                ${data.status === 'aktif' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {data.status}
                            </span>
                        </div>
                        <div className="pt-4">
                            <Link href="/route" className="block w-full text-center py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-medium">
                                Kembali
                            </Link>
                        </div>
                    </div>

                    {/* Static Map */}
                    <div className="lg:col-span-2 h-[400px] border border-gray-300 rounded-xl overflow-hidden relative">
                        <RouteMap points={points} readOnly={true} />
                        <div className="absolute bottom-2 right-2 bg-white/80 px-2 py-1 rounded text-xs z-[1000]">
                            Mode: Read Only
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}