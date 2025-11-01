'use client';

import { useEffect, useState } from 'react';
import DriverRow from './DriverRow';
import SearchBar from '@/components/SearchBar';
import AddButton from '@/components/AddButton';
import FilterDropdown from '@/components/FilterDropdown';
import Pagination from '@/components/Pagination';
import { API_URL } from '@/lib/config';

// Tipe data Driver
interface Driver {
  id_driver: number;
  kode_driver: string;
  nama: string;
  tanggal_lahir: string;
  nomor_telepon: string;
  status: 'berjalan' | 'berhenti' | 'dijadwalkan' | string;
}

export default function DriverTable() {
  const [allDrivers, setAllDrivers] = useState<Driver[]>([]);
  const [filteredDrivers, setFilteredDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 7;

  const handleShow = (driver: Driver) => alert(`Detail: ${driver.nama}`);
  const handleEdit = (driver: Driver) => alert(`Edit: ${driver.nama}`);
  const handleDelete = (driver: Driver) => alert(`Hapus: ${driver.nama}?`);

  // --- Fetch Data ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/drivers`);
        if (!res.ok) throw new Error('Gagal fetch data driver');

        const data = await res.json();

        // Jika respons berisi objek dengan properti "data"
        if (Array.isArray(data.data)) {
          setAllDrivers(data.data);
          setFilteredDrivers(data.data);
        } else if (Array.isArray(data)) {
          setAllDrivers(data);
          setFilteredDrivers(data);
        } else {
          console.error('Format data API tidak sesuai:', data);
        }
      } catch (err) {
        if (err instanceof Error) console.error(err.message);
        else console.error('Unknown fetch error', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- Filter & Search (Client-side) ---
  useEffect(() => {
    let data = allDrivers;

    if (search) {
      data = data.filter(
        (d) =>
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

  // --- Pagination ---
  const totalPages = Math.ceil(filteredDrivers.length / perPage);
  const indexOfLast = currentPage * perPage;
  const indexOfFirst = indexOfLast - perPage;
  const currentData = filteredDrivers.slice(indexOfFirst, indexOfLast);

  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 border-b">
        <SearchBar
          value={search}
          onChange={setSearch}
          onClear={() => setSearch('')}
          onSubmit={(e) => e.preventDefault()}
        />
        <div className="flex items-center gap-2">
          <AddButton />
          <FilterDropdown
            filters={[
              {
                label: 'Status',
                options: ['berjalan', 'berhenti', 'dijadwalkan'],
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
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nama</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tanggal Lahir</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">No. Telepon</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">Memuat data...</td>
              </tr>
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
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">Tidak ada data yang cocok.</td>
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
