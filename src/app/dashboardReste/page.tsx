'use client';

import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Bus = {
    bus_id: number;
    latitude: number;
    longitude: number;
    speed: number;
    status?: string;
    server_time?: number;
};

export default function RestDashboard() {
    const [buses, setBuses] = useState<Bus[]>([]);
    const [loading, setLoading] = useState(true);

    // fetch REST API
    const fetchData = async () => {
        try {
            const res = await fetch(`${API_URL}/api/rest/bus-location`);

            console.log("STATUS:", res.status);

            const text = await res.text();
            console.log("RAW RESPONSE:", text);

            const data = JSON.parse(text);
            
            const result = await res.json();

            setBuses(result.data || []);
        } catch (err) {
            console.error("REST error:", err);
        } finally {
            setLoading(false);
        }
    };

    // polling tiap 2 detik
    useEffect(() => {
        fetchData();

        const interval = setInterval(fetchData, 2000);

        return () => clearInterval(interval);
    }, []);

    // statistik sederhana
    const total = buses.length;
    const active = buses.filter(b => b.speed > 0).length;
    const stopped = buses.filter(b => b.speed === 0).length;

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Dashboard REST API</h1>

            {/* STAT CARD */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-500 text-white p-4 rounded-xl">
                    <h2>Total Bus</h2>
                    <p className="text-2xl">{total}</p>
                </div>

                <div className="bg-green-500 text-white p-4 rounded-xl">
                    <h2>Berjalan</h2>
                    <p className="text-2xl">{active}</p>
                </div>

                <div className="bg-red-500 text-white p-4 rounded-xl">
                    <h2>Berhenti</h2>
                    <p className="text-2xl">{stopped}</p>
                </div>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-xl shadow p-4">
                <h2 className="text-lg font-semibold mb-4">Data Bus</h2>

                {loading ? (
                    <p>Loading...</p>
                ) : buses.length === 0 ? (
                    <p>Tidak ada data</p>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b">
                                <th>ID</th>
                                <th>Latitude</th>
                                <th>Longitude</th>
                                <th>Speed</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {buses.map((bus, i) => (
                                <tr key={i} className="border-b text-center">
                                    <td>{bus.bus_id}</td>
                                    <td>{bus.latitude}</td>
                                    <td>{bus.longitude}</td>
                                    <td>{bus.speed}</td>
                                    <td>
                                        {bus.speed > 0 ? (
                                            <span className="text-green-600">Berjalan</span>
                                        ) : (
                                            <span className="text-red-600">Berhenti</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}