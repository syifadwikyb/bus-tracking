'use client';

import { useEffect, useState } from 'react';
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
    // --- PERBAIKAN LOGIKA ---
    const [allBuses, setAllBuses] = useState<Bus[]>([]); // Menyimpan SEMUA bus dari API
    const [filteredBuses, setFilteredBuses] = useState<Bus[]>([]); // Data setelah difilter
    const [loading, setLoading] = useState(true);

    // State filter & search (tetap sama)
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterJenis, setFilterJenis] = useState('');
    const [filterKapasitas, setFilterKapasitas] = useState('');

    // State paginasi (tetap sama)
    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 7;

    // --- 1. Fetch Data (Hanya sekali saat memuat) ---
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            console.log("--- 1. Memulai Fetch Data ---");
            try {
                const res = await fetch(`${API_URL}/api/bus`);
                console.log("--- 2. Status Respons:", res.status);

                if (!res.ok) throw new Error('Gagal fetch bus');

                const data = await res.json();
                console.log("--- 3. Data Diterima (JSON):", data);

                // --- PERBAIKAN UTAMA ---
                // Cek apakah 'data' adalah array
                if (Array.isArray(data)) {
                    setAllBuses(data); // Simpan semua bus
                    setFilteredBuses(data); // Set data filter awal
                    console.log("--- 4. State Diperbarui (AllBuses)");
                } else {
                    // Fallback jika API tiba-tiba paginasi (data.data)
                    const busData = Array.isArray(data.data) ? data.data : [];
                    setAllBuses(busData);
                    setFilteredBuses(busData);
                }

            } catch (err) {
                if (err instanceof Error) {
                    console.error("--- X. ERROR:", err.message);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []); // Dependensi kosong, hanya jalan sekali

    // --- 2. Terapkan Filter & Search (Client-Side) ---
    useEffect(() => {
        // Mulai dengan semua data bus
        let data = allBuses;

        // Filter berdasarkan search
        if (search) {
            data = data.filter(
                (b) =>
                    b.plat_nomor.toLowerCase().includes(search.toLowerCase()) ||
                    b.jenis_bus.toLowerCase().includes(search.toLowerCase())
            );
        }
        // Filter berdasarkan status
        if (filterStatus) {
            data = data.filter((b) => b.status === filterStatus);
        }
        // Filter berdasarkan jenis bus
        if (filterJenis) {
            data = data.filter((b) => b.jenis_bus === filterJenis);
        }
        // Filter berdasarkan kapasitas
        if (filterKapasitas) {
            data = data.filter((b) => String(b.kapasitas) === filterKapasitas);
        }

        setFilteredBuses(data); // Set data yang sudah difilter
        setCurrentPage(1); // Reset ke halaman 1
    }, [search, filterStatus, filterJenis, filterKapasitas, allBuses]); // <-- Dijalankan saat filter atau data utama berubah

    // --- 3. Logika Paginasi (Client-Side) ---
    const totalPages = Math.ceil(filteredBuses.length / perPage);
    const indexOfLast = currentPage * perPage;
    const indexOfFirst = indexOfLast - perPage;
    const currentData = filteredBuses.slice(indexOfFirst, indexOfLast); // Data untuk halaman ini

    // --- 4. Event Handlers ---
    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault(); // Mencegah reload
    };
    const handleShow = (bus: Bus) => alert(`Menampilkan detail: ${bus.plat_nomor}`);
    const handleEdit = (bus: Bus) => alert(`Mengedit bus: ${bus.plat_nomor}`);
    const handleDelete = (bus: Bus) => alert(`Menghapus bus: ${bus.plat_nomor}?`);

    return (
        <div className="bg-white rounded-lg shadow-lg">
            {/* Kontrol (Search, Filter, Add) */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 border-b">
                <SearchBar
                    value={search}
                    onChange={setSearch}
                    onClear={() => setSearch('')}
                    onSubmit={handleSearchSubmit}
                />
                <div className="flex items-center gap-2">
                    <AddButton />
                    <FilterDropdown
                        filters={[
                            {
                                label: 'Status',
                                options: ['berjalan', 'dijadwalkan', 'berhenti', 'dalam perbaikan'],
                                value: filterStatus,
                                onChange: setFilterStatus,
                            },
                            {
                                label: 'Jenis Bus',
                                options: [...new Set(allBuses.map(b => b.jenis_bus))],
                                value: filterJenis,
                                onChange: setFilterJenis,
                            },
                            {
                                label: 'Kapasitas',
                                options: [...new Set(allBuses.map(b => String(b.kapasitas)))],
                                value: filterKapasitas,
                                onChange: setFilterKapasitas,
                            },
                        ]}
                    />
                </div>
            </div>

            {/* Tabel */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Bus Number</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Jenis Bus</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Kapasitas</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
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
                            // Render 'currentData' (data untuk halaman ini)
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
                            <tr>
                                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                                    Tidak ada data yang cocok.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Paginasi */}
            {totalPages > 1 && (
                <div className="px-6 py-3 border-t">
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