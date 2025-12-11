'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Import Router
import RouteRow, { Route } from './RouteRow'; // Import Interface Route dari RouteRow agar sinkron

import SearchBar from '@/components/SearchBar';
import AddButton from '@/components/AddButton';
import FilterDropdown from '@/components/FilterDropdown';
import Pagination from '@/components/Pagination';
import { API_URL } from '@/lib/config';

export default function RouteTable() {
    const router = useRouter();

    // State Data
    const [allRoutes, setAllRoutes] = useState<Route[]>([]);
    const [filteredRoutes, setFilteredRoutes] = useState<Route[]>([]);
    const [loading, setLoading] = useState(true);

    // State Filter
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    // State Paginasi
    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 7;

    // --- 1. Fetch Data ---
    async function fetchRoutes() {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/jalur`);
            if (!res.ok) throw new Error('Gagal fetch data rute');

            const data = await res.json();
            // Handle format { data: [...] } atau [...]
            const routeData = Array.isArray(data) ? data : (data.data || []);

            setAllRoutes(routeData);
            setFilteredRoutes(routeData);
        } catch (err) {
            console.error("Fetch Error:", err);
            setAllRoutes([]);
            setFilteredRoutes([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchRoutes();
    }, []);

    // --- 2. Filter Logic ---
    useEffect(() => {
        let data = allRoutes;

        if (search) {
            data = data.filter((r) =>
                (r.kode_jalur && r.kode_jalur.toLowerCase().includes(search.toLowerCase())) ||
                (r.nama_jalur && r.nama_jalur.toLowerCase().includes(search.toLowerCase()))
            );
        }

        if (filterStatus) {
            // Pastikan status di database match dengan filter (aktif/tidak aktif)
            // Jika di DB statusnya 'berjalan'/'berhenti', sesuaikan string di sini
            data = data.filter((r) => r.status.toLowerCase() === filterStatus.toLowerCase());
        }

        setFilteredRoutes(data);
        setCurrentPage(1);
    }, [search, filterStatus, allRoutes]);

    // --- 3. Action Handlers ---

    // Navigasi ke Halaman Detail
    const handleShow = (route: Route) => {
        router.push(`/route/action_route?mode=show&id=${route.id_jalur}`);
    };

    // Navigasi ke Halaman Edit
    const handleEdit = (route: Route) => {
        router.push(`/route/action_route?mode=edit&id=${route.id_jalur}`);
    };

    // Fungsi Delete (API Call)
    const handleDelete = async (route: Route) => {
        const confirmDelete = window.confirm(`Apakah Anda yakin ingin menghapus rute ${route.nama_jalur}?`);
        if (!confirmDelete) return;

        try {
            const res = await fetch(`${API_URL}/api/jalur/${route.id_jalur}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Gagal menghapus rute");

            alert("✅ Rute berhasil dihapus");
            fetchRoutes(); // Refresh data tabel
        } catch (error) {
            console.error(error);
            alert("❌ Gagal menghapus rute. Pastikan rute tidak digunakan di jadwal.");
        }
    };

    // --- 4. Pagination Logic ---
    const totalPages = Math.ceil(filteredRoutes.length / perPage);
    const currentData = filteredRoutes.slice(
        (currentPage - 1) * perPage,
        currentPage * perPage
    );

    return (
        <div className="bg-white rounded-lg shadow-lg">
            {/* Header Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 border-b">
                <SearchBar
                    value={search}
                    onChange={setSearch}
                    onClear={() => setSearch('')}
                    onSubmit={(e) => e.preventDefault()}
                />
                <div className="flex items-center gap-2">
                    {/* Pastikan route sesuai folder: action_route */}
                    <AddButton route="/route/action_route" />
                    <FilterDropdown
                        filters={[
                            {
                                label: 'Status',
                                options: ['aktif', 'tidak aktif'], // Sesuaikan dengan nilai di DB
                                value: filterStatus,
                                onChange: setFilterStatus,
                            },
                        ]}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Kode</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Nama Rute</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Data Polyline</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">Memuat data...</td>
                            </tr>
                        ) : currentData.length > 0 ? (
                            currentData.map((route) => (
                                <RouteRow
                                    key={route.id_jalur}
                                    route={route}
                                    onShow={handleShow}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">Tidak ada data rute.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
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