'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // ➕ Import Router
import BusRow from './BusRow';
import SearchBar from '@/components/SearchBar';
import AddButton from '@/components/AddButton';
import FilterDropdown from '@/components/FilterDropdown';
import Pagination from '@/components/Pagination';
import { API_URL } from '@/lib/config';

interface Bus {
    id_bus: number;
    kode_bus: string;
    plat_nomor: string;
    kapasitas: number;
    jenis_bus: string;
    status: 'berjalan' | 'dijadwalkan' | 'berhenti' | 'dalam perbaikan';
}

export default function BusTable() {
    const router = useRouter();
    const [allBuses, setAllBuses] = useState<Bus[]>([]);
    const [filteredBuses, setFilteredBuses] = useState<Bus[]>([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterJenis, setFilterJenis] = useState('');
    const [filterKapasitas, setFilterKapasitas] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 7;

    // Fetch Data
    async function fetchBuses() {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/bus`);
            if (!res.ok) throw new Error('Gagal fetch bus');
            const data = await res.json();
            const busData = Array.isArray(data) ? data : (data.data || []);
            setAllBuses(busData);
            setFilteredBuses(busData);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchBuses();
    }, []);

    // Filter Logic
    useEffect(() => {
        let data = allBuses;
        if (search) {
            data = data.filter((b) =>
                b.plat_nomor.toLowerCase().includes(search.toLowerCase()) ||
                b.jenis_bus.toLowerCase().includes(search.toLowerCase())
            );
        }
        if (filterStatus) data = data.filter((b) => b.status === filterStatus);
        if (filterJenis) data = data.filter((b) => b.jenis_bus === filterJenis);
        if (filterKapasitas) data = data.filter((b) => String(b.kapasitas) === filterKapasitas);

        setFilteredBuses(data);
        setCurrentPage(1);
    }, [search, filterStatus, filterJenis, filterKapasitas, allBuses]);

    // --- NAVIGASI KE HALAMAN ACTION ---
    function handleShow(bus: Bus) {
        router.push(`/bus/action_bus?mode=show&id=${bus.id_bus}`);
    }

    function handleEdit(bus: Bus) {
        router.push(`/bus/action_bus?mode=edit&id=${bus.id_bus}`);
    }

    // --- FUNGSI DELETE BUS ---
    async function handleDelete(bus: Bus) {
        const confirm = window.confirm(`Apakah Anda yakin ingin menghapus bus ${bus.plat_nomor}?`);
        if (!confirm) return;

        try {
            const res = await fetch(`${API_URL}/api/bus/${bus.id_bus}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Gagal menghapus data");

            alert("✅ Data Bus berhasil dihapus");
            fetchBuses(); // Refresh tabel
        } catch (error) {
            console.error(error);
            alert("❌ Gagal menghapus data. Pastikan bus tidak sedang digunakan di jadwal.");
        }
    }

    const totalPages = Math.ceil(filteredBuses.length / perPage);
    const currentData = filteredBuses.slice((currentPage - 1) * perPage, currentPage * perPage);

    return (
        <div className="bg-white rounded-lg shadow-lg">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4">
                <SearchBar
                    value={search}
                    onChange={setSearch}
                    onClear={() => setSearch('')}
                    onSubmit={(e) => e.preventDefault()}
                />
                <div className="flex items-center gap-2">
                    {/* 👇 Pastikan route ini benar mengarah ke folder action_bus */}
                    <AddButton route="/bus/action_bus" />

                    <FilterDropdown
                        filters={[
                            {
                                label: 'Status',
                                options: ['berjalan', 'dijadwalkan', 'berhenti', 'dalam perbaikan'],
                                value: filterStatus,
                                onChange: setFilterStatus,
                            },
                            {
                                label: 'Jenis',
                                options: [...new Set(allBuses.map(b => b.jenis_bus))],
                                value: filterJenis,
                                onChange: setFilterJenis,
                            }
                        ]}
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="text-center min-w-full divide-y divide-blue-200">
                    <thead className="bg-blue-50">
                        <tr>
                            <th className="px-6 py-3 text-center text-xs font-semibold text-blue-500 uppercase">Plat Nomor</th>
                            <th className="px-6 py-3 text-center text-xs font-semibold text-blue-500 uppercase">Jenis Bus</th>
                            <th className="px-6 py-3 text-center text-xs font-semibold text-blue-500 uppercase">Kapasitas</th>
                            <th className="px-6 py-3 text-center text-xs font-semibold text-blue-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-center text-xs font-semibold text-blue-500 uppercase">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr><td colSpan={5} className="px-6 py-4 text-center text-gray-500">Memuat data...</td></tr>
                        ) : currentData.length > 0 ? (
                            currentData.map((bus) => (
                                <BusRow
                                    key={bus.id_bus}
                                    bus={bus}
                                    onShow={handleShow}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            ))
                        ) : (
                            <tr><td colSpan={5} className="px-6 py-4 text-center text-gray-500">Tidak ada data.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="px-6 py-3">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPrev={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                        onNext={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                        onPageSelect={setCurrentPage}
                    />
                </div>
            )}
        </div>
    );
}