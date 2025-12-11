// app/bus_stop/dashboard/components/BusActivityChart.tsx
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import type { Bus } from '../DashboardClient';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    CartesianGrid
} from 'recharts';

type ActivityItem = {
    id_bus?: number | string;
    nama_bus?: string;
    nama?: string;
    active_count: number;
    inactive_count: number;
};

const ranges = [
    { value: '1d', label: '1 Hari' },
    { value: '7d', label: '7 Hari' },
    { value: '30d', label: '30 Hari' },
    { value: '90d', label: '3 Bulan' },
    { value: '365d', label: '1 Tahun' },
];

interface Props {
    // Opsional: jika tersedia, gunakan snapshot realtime buses
    buses?: Bus[];
    // Jika kamu mau, parent bisa kontrol range
    initialRange?: string;
}

export default function BusActivityChart({ buses, initialRange = '7d' }: Props) {
    const [range, setRange] = useState(initialRange);
    const [data, setData] = useState<ActivityItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getMaxRange = (range: string) => {
        switch (range) {
            case "1d": return 1;
            case "7d": return 7;
            case "30d": return 30;
            case "90d": return 90;
            case "365d": return 365;
            default: return 10;
        }
    };


    // Jika `buses` diberikan: buat dataset sederhana berdasarkan status saat ini
    const computedFromRealtime = useMemo<ActivityItem[] | null>(() => {
        if (!buses || buses.length === 0) return null;

        return buses.map(b => ({
            id_bus: b.id_bus,
            nama_bus: b.plat_nomor || b.kode_bus || String(b.id_bus),
            nama: b.nama || undefined,
            active_count: (b.status?.toLowerCase() === 'berjalan' || (!!b.latitude && !!b.longitude)) ? 1 : 0,
            inactive_count: (b.status?.toLowerCase() === 'berjalan' || (!!b.latitude && !!b.longitude)) ? 0 : 1,
        }));
    }, [buses]);

    // Jika ada buses realtime, langsung pakai itu (mengabaikan fetch historis).
    useEffect(() => {
        let mounted = true;

        const fetchData = async () => {
            if (computedFromRealtime) {
                setData(computedFromRealtime);
                setError(null);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const res = await fetch(`/api/bus/activity?range=${encodeURIComponent(range)}`);
                if (!res.ok) throw new Error('Gagal mengambil data activity dari server');
                const json = await res.json();
                // Pastikan struktur backend: [{ nama_bus, active_count, inactive_count, id_bus? }]
                const mapped: ActivityItem[] = Array.isArray(json) ? json.map((it: any) => ({
                    id_bus: it.id_bus ?? it.id ?? it.nama_bus,
                    nama_bus: it.nama_bus ?? it.nama ?? String(it.id_bus ?? it.id ?? 'unknown'),
                    nama: it.nama ?? undefined,
                    active_count: Number(it.active_count ?? it.activ_count ?? 0),
                    inactive_count: Number(it.inactive_count ?? it.inact_count ?? 0),
                })) : [];
                if (!mounted) return;
                setData(mapped);
            } catch (err: any) {
                if (!mounted) return;
                setError(err?.message ?? 'Error');
                setData([]);
            } finally {
                if (!mounted) return;
                setLoading(false);
            }
        };

        fetchData();

        return () => { mounted = false; };
    }, [range, computedFromRealtime]);

    return (
        <div className="bg-white rounded-md shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">Chart Aktivitas Bus</h3>
                <div className="flex items-center gap-2">
                    <select value={range} onChange={(e) => setRange(e.target.value)} className="border px-2 py-1 rounded">
                        {ranges.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="text-center p-6">Memuat chart...</div>
            ) : error ? (
                <div className="text-red-500">{error}</div>
            ) : data.length === 0 ? (
                <div className="text-gray-500 text-sm p-6">Tidak ada data aktivitas untuk rentang waktu ini.</div>
            ) : (
                <div style={{ width: '100%', height: 340 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />

                            <XAxis
                                dataKey="nama_bus"
                                interval={0}
                                angle={-20}
                                textAnchor="end"
                                height={70}
                                tickFormatter={(txt) => String(txt).slice(0, 20)}
                            />

                            <YAxis domain={[0, getMaxRange(range)]} tickCount={6} />

                            <Tooltip />
                            <Legend />

                            <Bar
                                dataKey="active_count"
                                name="Aktif"
                                barSize={20}
                                fill="#4CAF50"
                            />

                            <Bar
                                dataKey="inactive_count"
                                name="Tidak Aktif"
                                barSize={20}
                                fill="#EF4444"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

            )}
        </div>
    );
}
