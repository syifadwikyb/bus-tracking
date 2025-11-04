// app/bus_stop/dashboard/DashboardClient.tsx
'use client';

import MapView from './components/MapView';
import BusTable from './components/BusTable';
import DriverInfo from './components/DriverInfo';
import BusDetail from './components/BusDetail';
import PassengerChart from './components/PassengerChart';

// Tipe 'Bus' yang akan digunakan di seluruh aplikasi frontend
export type Bus = {
  id_bus: number;
  kode_bus: string;
  plat_nomor: string;
  jenis_bus: string;
  status: 'berjalan' | 'berhenti' | 'dalam perbaikan' | string;
  latitude: number | null;
  longitude: number | null;
  penumpang: number;
  kapasitas: number;
  nama: string | null;       // Nama driver
  nama_jalur: string | null; // Nama jalur
  terakhir_dilihat: string | null;
  foto: string | null;       // Foto bus
  driver_foto: string | null; // Foto driver

  // 🆕 Tambahkan ini:
  jadwal?: {
    status: string;
    driver?: { nama: string; foto?: string };
    jalur?: { nama_jalur: string };
    tanggal?: string;
    jam_mulai?: string;
    jam_selesai?: string;
  }[];
};

export interface Stats {
  active: number;
  scheduled: number;
  nonActive: number;
  maintenance: number;
}

interface DashboardClientProps {
  buses: Bus[];
  routes: any[];
  selectedBus: Bus | null;
  onBusSelect: (bus: Bus | null) => void;
  stats: Stats | null;
  loading: boolean;
  selectedRoute: any;
  onRouteSelect: (route: any | null) => void;
}

export default function DashboardClient({
  buses,
  routes,
  selectedBus,
  onBusSelect,
  stats,
  loading,
  selectedRoute,
  onRouteSelect
}: DashboardClientProps) {
  // Semua logika fetch dan socket.io DIHAPUS dari sini

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  const activeBuses = buses.filter(bus => bus.status === 'berjalan' || (bus.latitude && bus.longitude));

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Kiri: Map + Tabel */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Peta Tracking Bus</h3>
            <select
              onChange={(e) => {
                const routeId = e.target.value ? parseInt(e.target.value) : null;
                // Cari rute ringkas dari 'routes' prop
                const routeSummary = routes.find(r => r.id_jalur === routeId);
                // Panggil handler dari parent ('page.tsx')
                onRouteSelect(routeSummary || null);
              }}
              className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Pilih Rute</option>
              {/* Gunakan 'routes' dari prop */}
              {routes.map(route => (
                <option key={route.id_jalur} value={route.id_jalur}>
                  {route.nama_jalur}
                </option>
              ))}
            </select>
          </div>
          <div className="h-[400px] w-full">
            <MapView
              buses={buses} // Kirim *semua* bus
              selectedRoute={selectedRoute} // Kirim rute detail yang dipilih
              onBusClick={onBusSelect}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Bus Aktif ({activeBuses.length})</h3>
          </div>
          <BusTable buses={activeBuses} onRowClick={onBusSelect} />
        </div>
      </div>

      {/* Kanan: Detail + Grafik */}
      <div className="flex flex-col gap-6">
        {selectedBus && (
          <>
            {/* Komponen ini sekarang akan menerima 'nama' dan 'driver_foto' dengan benar */}
            <DriverInfo bus={selectedBus} />
            <BusDetail bus={selectedBus} />
            <PassengerChart bus={selectedBus} />
          </>
        )}
        {!selectedBus && (
          <div className="bg-white rounded-lg shadow-md p-4 text-center text-gray-500">
            Pilih bus untuk melihat detail
          </div>
        )}
      </div>
    </div>
  );
}