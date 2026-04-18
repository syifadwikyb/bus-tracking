'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import MaintenanceRow from './MaintenanceRow';
import SearchBar from '@/components/SearchBar';
import AddButton from '@/components/AddButton';
import FilterDropdown from '@/components/FilterDropdown';
import Pagination from '@/components/Pagination';
import Swal from 'sweetalert2';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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

  const router = useRouter();
  const handleShow = (item: Maintenance) => {
    router.push(`/maintenance/action?mode=show&id=${item.id_maintenance}`);
  };

  const handleEdit = (item: Maintenance) => {
    router.push(`/maintenance/action?mode=edit&id=${item.id_maintenance}`);
  };

  const handleDelete = async (item: Maintenance) => {
    const result = await Swal.fire({
      title: 'Apakah Anda yakin?',
      text: `Hapus data perbaikan bus ${item.bus?.plat_nomor || ''}? Tindakan ini tidak dapat dibatalkan!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3B82F6',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`${API_URL}/api/maintenance/${item.id_maintenance}`, {
          method: 'DELETE',
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Gagal menghapus data');
        }

        setAllData(allData.filter(d => d.id_maintenance !== item.id_maintenance));
        setFilteredData(filteredData.filter(d => d.id_maintenance !== item.id_maintenance));

        Swal.fire({
          icon: 'success',
          title: 'Dihapus!',
          text: 'Data perawatan berhasil dihapus.',
          confirmButtonText: 'OK',
          confirmButtonColor: '#3B82F6'
        });

      } catch (err) {
        console.error('❌ Gagal menghapus:', err);
        Swal.fire('Gagal!', err instanceof Error ? err.message : 'Terjadi kesalahan.', 'error');
      }
    }
  };

  const handlePrint = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Cetak Laporan Perawatan Bus',
      html: `
        <div class="flex flex-col gap-3 text-left">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai</label>
            <input type="date" id="swal-start-date" class="w-full border border-gray-300 rounded-md p-2">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal Akhir</label>
            <input type="date" id="swal-end-date" class="w-full border border-gray-300 rounded-md p-2">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select id="swal-status" class="w-full border border-gray-300 rounded-md p-2">
              <option value="">Semua Status</option>
              <option value="sedang diperbaiki">Sedang Diperbaiki</option>
              <option value="dijadwalkan">Dijadwalkan</option>
              <option value="selesai">Selesai</option>
            </select>
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Cetak',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#10B981',
      preConfirm: () => {
        return {
          startDate: (document.getElementById('swal-start-date') as HTMLInputElement).value,
          endDate: (document.getElementById('swal-end-date') as HTMLInputElement).value,
          status: (document.getElementById('swal-status') as HTMLSelectElement).value,
        };
      }
    });

    if (formValues) {
      let dataToPrint = allData;

      if (formValues.status) {
        dataToPrint = dataToPrint.filter(d => d.status.toLowerCase() === formValues.status.toLowerCase());
      }

      if (formValues.startDate && formValues.endDate) {
        dataToPrint = dataToPrint.filter(d => {
          const maintenanceDate = new Date(d.tanggal_perbaikan);
          const start = new Date(formValues.startDate);
          const end = new Date(formValues.endDate);
          return maintenanceDate >= start && maintenanceDate <= end;
        });
      }

      const printWindow = window.open('', '_blank');
      if (!printWindow) return;

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Laporan Perawatan Bus</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 10px; }
            .header h2 { margin: 0 0 10px 0; }
            .info { margin-bottom: 20px; font-size: 14px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; font-size: 14px; }
            th { background-color: #f4f4f4; text-transform: uppercase; }
            .text-right { text-align: right; }
            .text-center { text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>LAPORAN PERAWATAN BUS UNIVERSITAS DIPONEGORO</h2>
          </div>
          <div class="info">
            <strong>Periode:</strong> ${formValues.startDate ? formValues.startDate : 'Semua'} s/d ${formValues.endDate ? formValues.endDate : 'Semua'}<br>
            <strong>Status Filter:</strong> ${formValues.status ? formValues.status.toUpperCase() : 'SEMUA STATUS'}
          </div>
          <table>
            <thead>
              <tr>
                <th class="text-center">No</th>
                <th>Plat Nomor</th>
                <th>Tgl Perbaikan</th>
                <th>Tgl Selesai</th>
                <th>Deskripsi</th>
                <th>Status</th>
                <th class="text-right">Harga (Rp)</th>
              </tr>
            </thead>
            <tbody>
              ${dataToPrint.length > 0 ? dataToPrint.map((d, index) => `
                <tr>
                  <td class="text-center">${index + 1}</td>
                  <td>${d.bus?.plat_nomor || '-'}</td>
                  <td>${d.tanggal_perbaikan ? new Date(d.tanggal_perbaikan).toLocaleDateString('id-ID') : '-'}</td>
                  <td>${d.tanggal_selesai ? new Date(d.tanggal_selesai).toLocaleDateString('id-ID') : '-'}</td>
                  <td>${d.deskripsi || '-'}</td>
                  <td>${d.status || '-'}</td>
                  <td class="text-right">${d.harga ? d.harga.toLocaleString('id-ID') : '0'}</td>
                </tr>
              `).join('') : '<tr><td colspan="7" class="text-center">Tidak ada data pada periode dan status ini.</td></tr>'}
            </tbody>
          </table>
          <script>
            window.onload = function() {
              window.print();                            
            }
          </script>
        </body>
        </html>
      `;

      printWindow.document.write(htmlContent);
      printWindow.document.close();
    }
  };

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

  const totalPages = Math.ceil(filteredData.length / perPage);
  const indexOfLast = currentPage * perPage;
  const indexOfFirst = indexOfLast - perPage;
  const currentData = filteredData.slice(indexOfFirst, indexOfLast);

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
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-lg shadow-md hover:bg-green-800 transition-all"
            title="Cetak Laporan"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M2.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z" />
              <path d="M5 1a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V3a2 2 0 0 0-2-2H5zM4 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2H4V3zm1 5a2 2 0 0 0-2 2v1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v-1a2 2 0 0 0-2-2H5zm7 2v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1z" />
            </svg>
            <span className="font-medium">Print</span>
          </button>

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

      <div className="overflow-x-auto">
        <table className="text-center min-w-full divide-y divide-blue-200">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-6 py-3 text-center text-xs font-semibold text-blue-500 uppercase tracking-wider">Bus</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-blue-500 uppercase tracking-wider">Tanggal Perbaikan</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-blue-500 uppercase tracking-wider">Tanggal Selesai</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-blue-500 uppercase tracking-wider">Deskripsi</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-blue-500 uppercase tracking-wider">Harga</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-blue-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-blue-500 uppercase tracking-wider">Aksi</th>
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
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <tr><td colSpan={7} className="px-6 py-4 text-center text-gray-500">Tidak ada data maintenance.</td></tr>
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