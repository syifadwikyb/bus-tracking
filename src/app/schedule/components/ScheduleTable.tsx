'use client';

import { useEffect, useState } from 'react';
import ScheduleRow from './ScheduleRow';
import SearchBar from '@/components/SearchBar';
import AddButton from '@/components/AddButton';
import FilterDropdown from '@/components/FilterDropdown';
import Pagination from '@/components/Pagination';
import { API_URL } from '@/lib/config';

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
    const [allSchedules, setAllSchedules] = useState<Schedule[]>([]);
    const [filtered, setFiltered] = useState<Schedule[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [page, setPage] = useState(1);
    const perPage = 7;

    const handleShow = (s: Schedule) => alert(`Lihat jadwal bus: ${s.bus.plat_nomor}`);
    const handleEdit = (s: Schedule) => alert(`Edit jadwal bus: ${s.bus.plat_nomor}`);
    const handleDelete = (s: Schedule) => alert(`Hapus jadwal ${s.bus.plat_nomor}?`);

    useEffect(() => {
        const fetchSchedules = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${API_URL}/api/schedules`);
                if (!res.ok) throw new Error('Gagal memuat data jadwal');
                const data = await res.json();

                if (Array.isArray(data.data)) {
                    setAllSchedules(data.data);
                    setFiltered(data.data);
                } else if (Array.isArray(data)) {
                    setAllSchedules(data);
                    setFiltered(data);
                } else {
                    console.error('Format data API tidak sesuai:', data);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        fetchSchedules();
    }, []);

    useEffect(() => {
        let data = allSchedules;

        if (search) {
            data = data.filter(
                (s) =>
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

    const totalPages = Math.ceil(filtered.length / perPage);
    const currentData = filtered.slice((page - 1) * perPage, page * perPage);

    return (
        <div className="bg-white rounded-lg shadow-lg">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 border-b">
                <SearchBar
                    value={search}
                    onChange={setSearch}
                    onClear={() => setSearch('')}
                    onSubmit={(e) => e.preventDefault()} // Tambahkan ini
                />

                <div className="flex items-center gap-2">
                    <AddButton />
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
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Plat Nomor
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Driver
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Hari & Tanggal
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Jam Mulai
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Jam Selesai
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Action
                            </th>
                        </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                                    Memuat data...
                                </td>
                            </tr>
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
                            <tr>
                                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                                    Tidak ada data yang cocok.
                                </td>
                            </tr>
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
