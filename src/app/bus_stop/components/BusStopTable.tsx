'use client';

import { useEffect, useState } from 'react';
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
    jalur?: { nama_jalur: string }; // relasi opsional
}

export default function BusStopTable() {
    const [busStops, setBusStops] = useState<BusStop[]>([]);
    const [filtered, setFiltered] = useState<BusStop[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const perPage = 7;

    // Ambil data halte dari API
    useEffect(() => {
        const fetchBusStops = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${API_URL}/api/halte`);
                if (!res.ok) throw new Error('Gagal memuat data halte');
                const data = await res.json();

                // Karena API langsung return array
                if (Array.isArray(data)) {
                    setBusStops(data);
                    setFiltered(data);
                } else if (Array.isArray(data.data)) {
                    // Antisipasi kalau backend diubah nanti
                    setBusStops(data.data);
                    setFiltered(data.data);
                } else {
                    console.error('Format data API tidak sesuai:', data);
                }

            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        fetchBusStops();
    }, []);

    // Filter pencarian
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

    const handleShow = (halte: BusStop) => alert(`Detail halte: ${halte.nama_halte}`);
    const handleEdit = (halte: BusStop) => alert(`Edit halte: ${halte.nama_halte}`);
    const handleDelete = (halte: BusStop) => alert(`Hapus halte: ${halte.nama_halte}?`);

    return (
        <div className="bg-white rounded-lg shadow-lg">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 border-b">
                <SearchBar
                    value={search}
                    onChange={setSearch}
                    onClear={() => setSearch('')}
                    onSubmit={(e) => e.preventDefault()}
                />
                <AddButton />
            </div>

            {/* Tabel */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nama Halte</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Latitude</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Longitude</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Jalur</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                                    Memuat data...
                                </td>
                            </tr>
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
                            <tr>
                                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                                    Tidak ada data halte.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
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
