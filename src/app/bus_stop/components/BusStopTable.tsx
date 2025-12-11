'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // ➕ Import Router
import BusStopRow from './BusStopRow';
import SearchBar from '@/components/SearchBar';
import AddButton from '@/components/AddButton';
import Pagination from '@/components/Pagination';
import { API_URL } from '@/lib/config';

interface BusStop {
    id_halte: number;
    nama_halte: string;
    latitude: string;
    longitude: string;
    jalur?: { nama_jalur: string };
}

export default function BusStopTable() {
    const router = useRouter(); // ➕ Init Router
    const [busStops, setBusStops] = useState<BusStop[]>([]);
    const [filtered, setFiltered] = useState<BusStop[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const perPage = 7;

    // Fetch Data
    const fetchBusStops = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/halte`);
            if (!res.ok) throw new Error('Gagal memuat data halte');
            const data = await res.json();
            const list = Array.isArray(data) ? data : (data.data || []);
            setBusStops(list);
            setFiltered(list);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBusStops();
    }, []);

    // Filter
    useEffect(() => {
        let result = busStops;
        if (search) {
            result = result.filter((halte) =>
                halte.nama_halte.toLowerCase().includes(search.toLowerCase())
            );
        }
        setFiltered(result);
        setPage(1);
    }, [search, busStops]);

    const totalPages = Math.ceil(filtered.length / perPage);
    const currentData = filtered.slice((page - 1) * perPage, page * perPage);

    // --- ➕ LOGIKA NAVIGASI & DELETE ---

    const handleShow = (halte: BusStop) => {
        router.push(`/bus_stop/action_bus_stop?mode=show&id=${halte.id_halte}`);
    };

    const handleEdit = (halte: BusStop) => {
        router.push(`/bus_stop/action_bus_stop?mode=edit&id=${halte.id_halte}`);
    };

    const handleDelete = async (halte: BusStop) => {
        if (!confirm(`Hapus halte ${halte.nama_halte}?`)) return;

        try {
            const res = await fetch(`${API_URL}/api/halte/${halte.id_halte}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Gagal menghapus halte");

            alert("✅ Halte berhasil dihapus");
            fetchBusStops(); // Refresh data
        } catch (error) {
            console.error(error);
            alert("❌ Gagal menghapus halte.");
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 border-b">
                <SearchBar
                    value={search}
                    onChange={setSearch}
                    onClear={() => setSearch('')}
                    onSubmit={(e) => e.preventDefault()}
                />
                <AddButton route="/bus_stop/action_bus_stop" />
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Nama Halte</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Latitude</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Longitude</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Jalur</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr><td colSpan={5} className="px-6 py-4 text-center text-gray-500">Memuat data...</td></tr>
                        ) : currentData.length > 0 ? (
                            currentData.map((halte) => (
                                <BusStopRow
                                    key={halte.id_halte}
                                    halte={halte}
                                    onShow={handleShow}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            ))
                        ) : (
                            <tr><td colSpan={5} className="px-6 py-4 text-center text-gray-500">Tidak ada data halte.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="px-6 py-3 border-t">
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPrev={() => setPage((p) => Math.max(p - 1, 1))}
                        onNext={() => setPage((p) => Math.min(p + 1, totalPages))}
                        onPageSelect={setPage}
                    />
                </div>
            )}
        </div>
    );
}