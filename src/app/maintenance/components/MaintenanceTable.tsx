'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MaintenanceRow from './MaintenanceRow';
import SearchBar from '@/components/SearchBar';
import AddButton from '@/components/AddButton';
import FilterDropdown from '@/components/FilterDropdown';
import Pagination from '@/components/Pagination';
import { API_URL } from '@/lib/config';

// 1. Impor SweetAlert
import Swal from 'sweetalert2';
// Opsional: Impor styling default (bisa juga di layout.tsx global)
import 'sweetalert2/dist/sweetalert2.css';

// Interface Maintenance (asumsi sama)
interface Maintenance {
  id_maintenance: number;
  bus_id: number;
  tanggal_perbaikan: string;
  tanggal_selesai?: string | null;
  deskripsi: string;
  status: string;
  harga: number;
  bus?: {
    plat_nomor: string;
    status: string;
  };
}

export default function MaintenanceTable() {
  const [allData, setAllData] = useState<Maintenance[]>([]);
  const [filteredData, setFilteredData] = useState<Maintenance[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 7;

  // 2. State untuk modal kustom TIDAK DIPERLUKAN LAGI
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [itemToDelete, setItemToDelete] = useState<Maintenance | null>(null);

  const router = useRouter();

  // --- Navigasi (Tetap Sama) ---
  const handleShow = (item: Maintenance) => {
    router.push(`/maintenance/action?mode=show&id=${item.id_maintenance}`);
  };

  const handleEdit = (item: Maintenance) => {
    router.push(`/maintenance/action?mode=edit&id=${item.id_maintenance}`);
  };

  // --- 3. Logika Delete (BARU dengan SweetAlert) ---
  const handleDelete = async (item: Maintenance) => {
    // Tampilkan konfirmasi SweetAlert
    const result = await Swal.fire({
      title: 'Apakah Anda yakin?',
      text: `Hapus data perbaikan bus ${item.bus?.plat_nomor || ''}? Tindakan ini tidak dapat dibatalkan!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33', // Merah
      cancelButtonColor: '#3B82F6', // Biru
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
    });

    // Jika pengguna mengklik "Ya, hapus!"
    if (result.isConfirmed) {
      try {
        const res = await fetch(`${API_URL}/api/maintenance/${item.id_maintenance}`, {
          method: 'DELETE',
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Gagal menghapus data');
        }

        // Update state di frontend
        setAllData(allData.filter(d => d.id_maintenance !== item.id_maintenance));
        setFilteredData(filteredData.filter(d => d.id_maintenance !== item.id_maintenance));

        // Tampilkan notifikasi sukses
        Swal.fire(
          'Dihapus!',
          'Data maintenance berhasil dihapus.',
          'success'
        );

      } catch (err) {
        console.error('❌ Gagal menghapus:', err);
        // Tampilkan notifikasi error
        Swal.fire(
          'Gagal!',
          err instanceof Error ? err.message : 'Terjadi kesalahan.',
          'error'
        );
      }
    }
  };


  // Fetch data dari API (tetap sama)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/maintenance`);
        if (!res.ok) throw new Error('Gagal mengambil data maintenance');
        const data = await res.json();
        const list = Array.isArray(data.data) ? data.data : data;
        setAllData(list);
        setFilteredData(list);
      } catch (err) {
        if (err instanceof Error) console.error('❌ Error fetch:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter & Search (tetap sama)
  useEffect(() => {
    let data = allData;
    if (search) {
      data = data.filter(
        (d) =>
          d.deskripsi?.toLowerCase().includes(search.toLowerCase()) ||
          d.bus?.plat_nomor?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (filterStatus) {
      data = data.filter((d) => d.status?.toLowerCase() === filterStatus.toLowerCase());
    }
    setFilteredData(data);
    setCurrentPage(1);
  }, [search, filterStatus, allData]);

  // Pagination (tetap sama)
  const totalPages = Math.ceil(filteredData.length / perPage);
  const indexOfLast = currentPage * perPage;
  const indexOfFirst = indexOfLast - perPage;
  const currentData = filteredData.slice(indexOfFirst, indexOfLast);

  return (
    // 4. Kita tidak perlu Fragment <> lagi
    <div className="bg-white rounded-lg shadow-lg">
      {/* Toolbar (tetap sama) */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 border-b">
        <SearchBar
          value={search}
          onChange={setSearch}
          onClear={() => setSearch('')}
          onSubmit={(e) => e.preventDefault()}
        />
        <div className="flex items-center gap-2">
          <AddButton route="/maintenance/action" />
          <FilterDropdown
            filters={[
              {
                label: 'Status',
                options: ['sedang diperbaiki', 'dijadwalkan', 'selesai'],
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
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Bus</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tanggal Perbaikan</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tanggal Selesai</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Deskripsi</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Harga</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={7} className="px-6 py-4 text-center text-gray-500">Memuat data...</td></tr>
            ) : currentData.length > 0 ? (
              currentData.map((m) => (
                <MaintenanceRow
                  key={m.id_maintenance}
                  maintenance={m}
                  onShow={handleShow}
                  onEdit={handleEdit}
                  onDelete={handleDelete} // <-- Panggil fungsi SweetAlert
                />
              ))
            ) : (
              <tr><td colSpan={7} className="px-6 py-4 text-center text-gray-500">Tidak ada data maintenance.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination (tetap sama) */}
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
    
    // 5. Komponen <ConfirmationModal> dihapus dari sini
  );
}