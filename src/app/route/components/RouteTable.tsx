'use client';

import { useEffect, useState } from 'react';
import RouteRow from './RouteRow';

// Impor komponen global (pastikan path ini benar)
import SearchBar from '@/components/SearchBar';
import AddButton from '@/components/AddButton';
import FilterDropdown from '@/components/FilterDropdown';
import Pagination from '@/components/Pagination';
import { API_URL } from '@/lib/config';

// Tipe data untuk Rute (Jalur) - Sesuai dengan backend
interface Route {
    id_jalur: number;
    kode_jalur: string; // <-- Diperbaiki (sesuai controller)
    nama_jalur: string; // <-- Diperbaiki (sesuai controller)
    rute_polyline: string;
    status: 'aktif' | 'tidak aktif';
}

// --- DATA MOCK DIHAPUS ---

export default function RouteTable() {
    // State untuk menyimpan data
    const [allRoutes, setAllRoutes] = useState<Route[]>([]); // Data asli dari API
    const [filteredRoutes, setFilteredRoutes] = useState<Route[]>([]); // Data setelah filter
    const [loading, setLoading] = useState(true);

    // State untuk filter & search
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    // State untuk paginasi
    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 7; // Tampilkan 7 item per halaman (sesuai desain)

    // --- 1. Fetch Data (Hanya sekali saat memuat) ---
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Ganti ke endpoint router Anda: /api/jalur
                const res = await fetch(`${API_URL}/api/jalur`);
                if (!res.ok) throw new Error('Gagal fetch data rute (jalur)');

                const data = await res.json();

                if (Array.isArray(data)) {
                    setAllRoutes(data);
                    setFilteredRoutes(data);
                } else if (data && Array.isArray(data.data)) {
                    setAllRoutes(data.data);
                    setFilteredRoutes(data.data);
                }
            } catch (err) {
                // --- PERBAIKAN ---
                // Tidak lagi menggunakan mockData saat error
                if (err instanceof Error) {
                    console.error("Fetch Error:", err.message);
                } else {
                    console.error("Fetch Error (unknown):", err);
                }
                setAllRoutes([]); // Set ke array kosong
                setFilteredRoutes([]); // Set ke array kosong
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []); // Dependensi kosong, hanya jalan sekali

    // --- 2. Terapkan Filter & Search (Client-Side) ---
    useEffect(() => {
        let data = allRoutes;

        // --- PERBAIKAN ---
        // Filter berdasarkan search (Kode Jalur atau Nama Jalur)
        if (search) {
            data = data.filter(
                (r) =>
                    // Cek null/undefined sebelum .toLowerCase()
                    (r.kode_jalur && r.kode_jalur.toLowerCase().includes(search.toLowerCase())) ||
                    (r.nama_jalur && r.nama_jalur.toLowerCase().includes(search.toLowerCase()))
            );
        }
        // Filter berdasarkan status
        if (filterStatus) {
            data = data.filter((r) => r.status === filterStatus);
        }

        setFilteredRoutes(data);
        setCurrentPage(1); // Reset ke halaman 1
    }, [search, filterStatus, allRoutes]);

    // --- 3. Logika Paginasi (Client-Side) ---
    const totalPages = Math.ceil(filteredRoutes.length / perPage);
    const indexOfLast = currentPage * perPage;
    const indexOfFirst = indexOfLast - perPage;
    const currentData = filteredRoutes.slice(indexOfFirst, indexOfLast); // Data untuk halaman ini

    // --- 4. Event Handlers ---
    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault(); // Mencegah reload
    };
    const handleShow = (route: Route) => alert(`Detail: ${route.nama_jalur}`);
    const handleEdit = (route: Route) => alert(`Edit: ${route.nama_jalur}`);
    const handleDelete = (route: Route) => alert(`Hapus: ${route.nama_jalur}?`);

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
                                options: ['aktif', 'tidak aktif'],
                                value: filterStatus,
                                onChange: setFilterStatus,
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
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Kode Rute</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nama Rute</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Rute Polyline</th>
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
                            currentData.map((route) => (
                                <RouteRow
                                    key={route.id_jalur}
                                    route={route}
                                    onShow={handleShow}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}/>
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

