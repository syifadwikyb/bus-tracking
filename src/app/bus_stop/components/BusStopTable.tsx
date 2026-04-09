'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import BusStopRow from './BusStopRow';
import SearchBar from '@/components/SearchBar';
import AddButton from '@/components/AddButton';
import Pagination from '@/components/Pagination';
import FilterDropdown from '@/components/FilterDropdown';
import { API_URL } from '@/lib/config';
import Swal from 'sweetalert2';

interface BusStop {
  id_halte: number;
  nama_halte: string;
  latitude: string;
  longitude: string;
  jalur?: { nama_jalur: string };
}

export default function BusStopTable() {
  const router = useRouter();
  const [busStops, setBusStops] = useState<BusStop[]>([]);
  const [filtered, setFiltered] = useState<BusStop[]>([]);
  const [loading, setLoading] = useState(true);

  // State Filter
  const [search, setSearch] = useState('');
  const [selectedJalur, setSelectedJalur] = useState('');
  const [availableRoutes, setAvailableRoutes] = useState<string[]>([]);

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

      // Ambil daftar jalur unik untuk opsi filter
      const routes = Array.from(new Set(
        list.map((item: BusStop) => item.jalur?.nama_jalur).filter((j: string) => j)
      )) as string[];
      setAvailableRoutes(routes.sort());

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

  // Filter Logic
  useEffect(() => {
    let result = busStops;

    if (search) {
      result = result.filter((halte) =>
        halte.nama_halte.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedJalur) {
      result = result.filter((halte) =>
        halte.jalur?.nama_jalur === selectedJalur
      );
    }

    setFiltered(result);
    setPage(1);
  }, [search, selectedJalur, busStops]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const currentData = filtered.slice((page - 1) * perPage, page * perPage);

  const handleShow = (halte: BusStop) => {
    router.push(`/bus_stop/action_bus_stop?mode=show&id=${halte.id_halte}`);
  };

  const handleEdit = (halte: BusStop) => {
    router.push(`/bus_stop/action_bus_stop?mode=edit&id=${halte.id_halte}`);
  };

  const handleDelete = async (halte: BusStop) => {    
    const result = await Swal.fire({
      title: 'Apakah Anda yakin?',
      text: `Hapus halte ${halte.nama_halte}? Tindakan ini tidak dapat dibatalkan!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3B82F6',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
    });

    // 2. Jika user mengonfirmasi penghapusan
    if (result.isConfirmed) {
      try {
        const res = await fetch(`${API_URL}/api/halte/${halte.id_halte}`, {
          method: "DELETE",
        });

        if (!res.ok) throw new Error("Gagal menghapus halte");

        // 3. Tampilkan notifikasi sukses
        Swal.fire({
          icon: 'success',
          title: 'Dihapus!',
          text: 'Data Halte berhasil dihapus.',
          confirmButtonText: 'OK',
          confirmButtonColor: '#3B82F6'
        });

        // Refresh data tabel
        fetchBusStops();
      } catch (error: any) {
        console.error('❌ Gagal menghapus:', error);

        // 4. Tampilkan notifikasi error
        Swal.fire({
          icon: 'error',
          title: 'Gagal!',
          text: error.message || "Gagal menghapus halte. Pastikan halte tidak sedang digunakan.",
          confirmButtonColor: '#EF4444'
        });
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4">
        {/* Search Bar di Kiri */}
        <SearchBar
          value={search}
          onChange={setSearch}
          onClear={() => setSearch('')}
          onSubmit={(e) => e.preventDefault()}
        />

        {/* ✅ 2. Group Button & Filter di Kanan (Sesuai DriverTable) */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <AddButton route="/bus_stop/action_bus_stop" />

          <FilterDropdown
            filters={[
              {
                label: 'Jalur',
                options: availableRoutes, // Menggunakan jalur dinamis dari API
                value: selectedJalur,
                onChange: setSelectedJalur
              }
            ]}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="text-center min-w-full divide-y divide-blue-200">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-6 py-3 text-center text-xs font-semibold text-blue-500 uppercase">Nama Halte</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-blue-500 uppercase">Latitude</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-blue-500 uppercase">Longitude</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-blue-500 uppercase">Jalur</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-blue-500 uppercase">Aksi</th>
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
              <tr><td colSpan={5} className="px-6 py-4 text-center text-gray-500">Tidak ada data halte ditemukan.</td></tr>
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