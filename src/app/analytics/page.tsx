'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AnalyticsPage() {
    const [type, setType] = useState("1day");
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const fetchData = async (selectedType: string) => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/analytics?type=${selectedType}`);
            const result = await res.json();
            setData(result);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData("1day");
    }, []);

    const handleFilter = (t: string) => {
        setType(t);
        fetchData(t);
    };

    const maxBus = Math.max(...(data?.bus?.map((b: any) => b.total_jam) || [1]));
    const maxDriver = Math.max(...(data?.driver?.map((d: any) => d.total_jam) || [1]));

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 11) return "Selamat Pagi Admin!";
        if (hour >= 11 && hour < 15) return "Selamat Siang Admin!";
        if (hour >= 15 && hour < 18) return "Selamat Sore Admin!";
        return "Selamat Malam Admin!";
    };

    return (
        <div className="bg-gray-50 min-h-screen p-8">

            <Header
                title="Analitik Bus & Sopir"
                subtitle={getGreeting()}
            />
            <div className="bg-white rounded-lg shadow-lg mt-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4">
                    <p className="text-lg font-semibold text-gray-700">
                        Ringkasan Aktivitas Terkini
                    </p>

                    <div className="flex gap-2 flex-wrap">
                        {[
                            { label: "1 Hari", value: "1day" },
                            { label: "7 Hari", value: "7days" },
                            { label: "1 Bulan", value: "1month" },
                            { label: "3 Bulan", value: "3months" },
                            { label: "1 Tahun", value: "1year" },
                        ].map((f) => (
                            <button
                                key={f.value}
                                onClick={() => handleFilter(f.value)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition
                                ${type === f.value
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 hover:bg-gray-200'
                                    }`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="pt-6">
                {loading ? (
                    <div className="text-center text-gray-500 py-10">
                        Memuat data...
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div className="bg-white rounded-lg shadow-xl p-4">
                            <h2 className="font-bold text-xl text-gray-800 mb-4">
                                Aktivitas Bus
                            </h2>

                            {!data?.bus || data.bus.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                                    <span className="text-3xl mb-2">🚌</span>
                                    <p className="text-sm">Tidak ada aktivitas bus</p>
                                </div>
                            ) : (
                                data.bus.map((b: any, i: number) => {
                                    const width = (b.total_jam / maxBus) * 100;

                                    return (
                                        <div key={i} className="flex items-center gap-3 mb-4">

                                            <img
                                                src={
                                                    b.foto
                                                        ? `${API_URL}/uploads/${b.foto}`
                                                        : "/assets/icons/bus.svg"
                                                }
                                                className="w-10 h-10 rounded-full object-cover border"
                                            />

                                            <div className="w-24 text-sm font-medium truncate">
                                                {b.name}
                                            </div>

                                            <div className="flex-1 bg-gray-200 rounded-full h-4">
                                                <div
                                                    className="bg-blue-500 h-4 rounded-full"
                                                    style={{ width: `${width}%` }}
                                                />
                                            </div>

                                            <div className="w-16 text-right text-sm text-gray-600">
                                                {b.total_jam.toFixed(1)}jam
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        <div className="bg-white rounded-lg shadow-xl p-4">
                            <h2 className="font-bold text-xl text-gray-800 mb-4">
                                Aktivitas Sopir
                            </h2>

                            {!data?.driver || data.driver.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                                    <span className="text-3xl mb-2">👤</span>
                                    <p className="text-sm">Tidak ada aktivitas sopir</p>
                                </div>
                            ) : (
                                data.driver.map((d: any, i: number) => {
                                    const width = (d.total_jam / maxDriver) * 100;

                                    return (
                                        <div key={i} className="flex items-center gap-3 mb-4">
                                            <img
                                                src={
                                                    d.driver_foto
                                                        ? `${API_URL}/uploads/${d.driver_foto}`
                                                        : "/assets/icons/Profile.svg"
                                                }
                                                className="w-10 h-10 rounded-full object-cover border"
                                            />

                                            <div className="w-32 text-sm font-medium truncate">
                                                {d.name}
                                            </div>

                                            <div className="flex-1 bg-gray-200 rounded-full h-4">
                                                <div
                                                    className="bg-green-500 h-4 rounded-full"
                                                    style={{ width: `${width}%` }}
                                                />
                                            </div>

                                            <div className="w-16 text-right text-sm text-gray-600">
                                                {d.total_jam.toFixed(1)}jam
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}