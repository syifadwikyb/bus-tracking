'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DriverRow from './DriverRow';
import SearchBar from '@/components/SearchBar';
import AddButton from '@/components/AddButton';
import FilterDropdown from '@/components/FilterDropdown';
import Pagination from '@/components/Pagination';
import Swal from 'sweetalert2';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Driver {
  id_driver: number;
  kode_driver: string;
  nama: string;
  tanggal_lahir: string;
  nomor_telepon: string;
  status: 'berjalan' | 'berhenti' | 'dijadwalkan' | string;
}

export default function DriverTable() {
  const router = useRouter(); // ➕ Init Router
  const [allDrivers, setAllDrivers] = useState<Driver[]>([]);
  const [filteredDrivers, setFilteredDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);

  // ... state lain tetap sama ...
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 7;

  // Fetch Data
  async function fetchDrivers() {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/drivers`);
      if (!res.ok) throw new Error('Gagal fetch data');
      const data = await res.json();
      const list = Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []);
      setAllDrivers(list);
      setFilteredDrivers(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDrivers();
  }, []);

  // Filter Logic (Tetap sama)
  useEffect(() => {
    let data = allDrivers;
    if (search) {
      data = data.filter((d) =>
        (d.nama && d.nama.toLowerCase().includes(search.toLowerCase())) ||
        (d.nomor_telepon && d.nomor_telepon.toLowerCase().includes(search.toLowerCase()))
      );
    }
    if (filterStatus) {
      data = data.filter((d) => d.status === filterStatus);
    }
    setFilteredDrivers(data);
    setCurrentPage(1);
  }, [search, filterStatus, allDrivers]);

  // --- NAVIGASI ACTION ---
  const handleShow = (driver: Driver) => {
    router.push(`/drivers/action_driver?mode=show&id=${driver.id_driver}`);
  };

  const handleEdit = (driver: Driver) => {
    router.push(`/drivers/action_driver?mode=edit&id=${driver.id_driver}`);
  };

  // --- DELETE FUNCTION ---
  const handleDelete = async (driver: Driver) => {
    const result = await Swal.fire({
      title: 'Apakah Anda yakin?',
      text: `Hapus driver ${driver.nama}? Tindakan ini tidak dapat dibatalkan!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3B82F6',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`${API_URL}/api/drivers/${driver.id_driver}`, {
          method: 'DELETE'
        });

        if (!res.ok) throw new Error("Gagal menghapus driver");

        // Tampilkan notifikasi sukses
        Swal.fire({
          icon: 'success',
          title: 'Dihapus!',
          text: 'Data Driver berhasil dihapus.',
          confirmButtonText: 'OK',
          confirmButtonColor: '#3B82F6'
        });

        // Refresh data setelah berhasil dihapus
        fetchDrivers();
      } catch (error: any) {
        console.error('❌ Gagal menghapus:', error);

        // Tampilkan notifikasi error
        Swal.fire({
          icon: 'error',
          title: 'Gagal!',
          text: error.message || "Gagal menghapus driver.",
          confirmButtonColor: '#EF4444'
        });
      }
    }
  };

  const totalPages = Math.ceil(filteredDrivers.length / perPage);
  const indexOfLast = currentPage * perPage;
  const indexOfFirst = indexOfLast - perPage;
  const currentData = filteredDrivers.slice(indexOfFirst, indexOfLast);

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4">
        <SearchBar value={search} onChange={setSearch} onClear={() => setSearch('')} onSubmit={(e) => e.preventDefault()} />
        <div className="flex items-center gap-2">
          <AddButton route="/drivers/action_driver" />
          <FilterDropdown
            filters={[{ label: 'Status', options: ['berjalan', 'berhenti', 'dijadwalkan'], value: filterStatus, onChange: setFilterStatus }]}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="text-center min-w-full divide-y divide-blue-200">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-6 py-3 text-center text-xs font-semibold text-blue-500 uppercase">Nama</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-blue-500 uppercase">Tanggal Lahir</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-blue-500 uppercase">No. Telepon</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-blue-500 uppercase">Status</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-blue-500 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-4 text-center text-gray-500">Memuat data...</td></tr>
            ) : currentData.length > 0 ? (
              currentData.map((driver) => (
                <DriverRow
                  key={driver.id_driver}
                  driver={driver}
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
          <Pagination currentPage={currentPage} totalPages={totalPages} onPrev={() => setCurrentPage((p) => Math.max(p - 1, 1))} onNext={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} onPageSelect={setCurrentPage} />
        </div>
      )}
    </div>
  );
}