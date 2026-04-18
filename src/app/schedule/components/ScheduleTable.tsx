'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ScheduleRow from './ScheduleRow';
import SearchBar from '@/components/SearchBar';
import AddButton from '@/components/AddButton';
import FilterDropdown from '@/components/FilterDropdown';
import Pagination from '@/components/Pagination';
import Swal from 'sweetalert2';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Schedule {
    id_schedule: number;
    bus: { plat_nomor: string };
    driver: { nama: string };
    tanggal: string;
    jam_mulai: string;
    jam_selesai: string;
    status: 'dijadwalkan' | 'berjalan' | 'selesai' | string;
}

export default function ScheduleTable() {
    const router = useRouter();
    const [allSchedules, setAllSchedules] = useState<Schedule[]>([]);
    const [filtered, setFiltered] = useState<Schedule[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [page, setPage] = useState(1);
    const perPage = 7;

    async function fetchSchedules() {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/schedules`);
            if (!res.ok) throw new Error("Gagal fetch");
            const data = await res.json();
            const list = Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []);
            setAllSchedules(list);
            setFiltered(list);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchSchedules();
    }, []);

    useEffect(() => {
        let data = allSchedules;
        if (search) {
            data = data.filter((s) =>
                s.bus?.plat_nomor?.toLowerCase().includes(search.toLowerCase()) ||
                s.driver?.nama?.toLowerCase().includes(search.toLowerCase())
            );
        }
        if (filterStatus) {
            data = data.filter((s) => s.status === filterStatus);
        }
        setFiltered(data);
        setPage(1);
    }, [search, filterStatus, allSchedules]);

    function handleShow(s: Schedule) {
        router.push(`/schedule/action_schedule?mode=show&id=${s.id_schedule}`);
    }

    function handleEdit(s: Schedule) {
        router.push(`/schedule/action_schedule?mode=edit&id=${s.id_schedule}`);
    }

    async function handleDelete(s: Schedule) {
        // 1. Tampilkan SweetAlert untuk Konfirmasi
        const result = await Swal.fire({
            title: 'Apakah Anda yakin?',
            text: `Hapus jadwal Bus ${s.bus.plat_nomor}? Tindakan ini tidak dapat dibatalkan!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3B82F6',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
        });

        // 2. Cek apakah user menekan tombol "Ya, hapus!"
        if (result.isConfirmed) {
            try {
                const res = await fetch(`${API_URL}/api/schedules/${s.id_schedule}`, {
                    method: "DELETE",
                });

                if (!res.ok) {
                    const errorData = await res.json().catch(() => ({}));
                    throw new Error(errorData.message || "Gagal menghapus data");
                }

                setAllSchedules(allSchedules.filter(sc => sc.id_schedule !== s.id_schedule));
                setFiltered(filtered.filter(sc => sc.id_schedule !== s.id_schedule));

                // 3. SweetAlert Sukses
                Swal.fire({
                    icon: 'success',
                    title: 'Dihapus!',
                    text: 'Jadwal berhasil dihapus.',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#3B82F6'
                });

            } catch (error: any) {
                console.error('❌ Gagal menghapus:', error);

                // 4. SweetAlert Error
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal!',
                    text: error.message || "Gagal menghapus data. Pastikan bus tidak sedang digunakan di jadwal.",
                    confirmButtonColor: '#EF4444'
                });
            }
        }
    }

    const totalPages = Math.ceil(filtered.length / perPage);
    const currentData = filtered.slice((page - 1) * perPage, page * perPage);

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
                    <AddButton route="/schedule/action_schedule" />
                    <FilterDropdown
                        filters={[
                            {
                                label: 'Status',
                                options: ['dijadwalkan', 'berjalan', 'selesai'],
                                value: filterStatus,
                                onChange: setFilterStatus,
                            },
                        ]}
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="text-center min-w-full divide-y divide-blue-200">
                    <thead className="bg-blue-50">
                        <tr>
                            <th className="px-6 py-3 text-center text-xs font-semibold text-blue-500 uppercase">Plat Nomor</th>
                            <th className="px-6 py-3 text-center text-xs font-semibold text-blue-500 uppercase">Driver</th>
                            <th className="px-6 py-3 text-center text-xs font-semibold text-blue-500 uppercase">Tanggal</th>
                            <th className="px-6 py-3 text-center text-xs font-semibold text-blue-500 uppercase">Jam Mulai</th>
                            <th className="px-6 py-3 text-center text-xs font-semibold text-blue-500 uppercase">Jam Selesai</th>
                            <th className="px-6 py-3 text-center text-xs font-semibold text-blue-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-center text-xs font-semibold text-blue-500 uppercase">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr><td colSpan={7} className="px-6 py-4 text-center text-gray-500">Memuat data...</td></tr>
                        ) : currentData.length > 0 ? (
                            currentData.map((schedule) => (
                                <ScheduleRow
                                    key={schedule.id_schedule}
                                    schedule={schedule}
                                    onShow={handleShow}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            ))
                        ) : (
                            <tr><td colSpan={7} className="px-6 py-4 text-center text-gray-500">Tidak ada data.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="px-6 py-3">
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