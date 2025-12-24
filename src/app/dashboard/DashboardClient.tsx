'use client';

import MapView from './components/MapView';
import BusTable from './components/BusTable';
import DriverInfo from './components/DriverInfo';
import BusDetail from './components/BusDetail';
import BusActivityChart from './components/BusActivityChart';

// Tipe Bus
export type Bus = {
  id_bus: number;
  kode_bus: string;
  plat_nomor: string;
  jenis_bus: string;
  status: string;
  latitude: number | null;
  longitude: number | null;
  penumpang: number;
  kapasitas: number;
  nama: string | null;
  nama_jalur: string | null;
  terakhir_dilihat: string | null;
  foto: string | null;
  driver_foto: string | null;
  jadwal?: any[];
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const activeBuses = buses.filter((bus) => {
    const status = bus.status?.toLowerCase();
    const hasCoords = bus.latitude && bus.longitude;

    return status === 'berjalan' && hasCoords;
  });

  // Placeholder bus kosong jika belum dipilih
  const emptyBus: Bus = {
    id_bus: 0,
    kode_bus: "N/A",
    plat_nomor: "N/A",
    jenis_bus: "N/A",
    status: "N/A",
    latitude: null,
    longitude: null,
    penumpang: 0,
    kapasitas: 0,
    nama: "N/A",
    nama_jalur: "N/A",
    terakhir_dilihat: "N/A",
    foto: null,
    driver_foto: null,
    jadwal: []
  };

  const displayedBus = selectedBus ?? emptyBus;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

      {/* Bagian Kiri */}
      <div className="lg:col-span-2 flex flex-col gap-6">

        {/* MAP */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Peta Tracking Bus</h3>

            <select
              onChange={(e) => {
                const routeId = e.target.value ? parseInt(e.target.value) : null;
                const routeSummary = routes.find(r => r.id_jalur === routeId);
                onRouteSelect(routeSummary || null);
              }}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value="">Pilih Rute</option>
              {routes.map(route => (
                <option key={route.id_jalur} value={route.id_jalur}>
                  {route.nama_jalur}
                </option>
              ))}
            </select>
          </div>

          <div className="h-[400px] w-full rounded-lg overflow-hidden border border-gray-200">
            {/* ✅ PENTING: Kita kirim 'buses' (semua data) ke MapView. 
               Pastikan di dalam file MapView.tsx logic filternya BENAR.
            */}
            <MapView
              buses={buses}
              selectedRoute={selectedRoute}
              onBusClick={onBusSelect}
            />
          </div>
        </div>

        {/* Tabel Bus Aktif */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200">
            <h3 className="text-lg font-semibold">
              Bus Aktif ({activeBuses.length})
            </h3>
          </div>

          {/* Kita hanya mengirim bus yang sudah difilter ke tabel */}
          <BusTable buses={activeBuses} onRowClick={onBusSelect} />
        </div>
      </div>

      {/* Bagian Kanan */}
      <div className="flex flex-col gap-6">
        <DriverInfo bus={displayedBus} />
        <BusDetail bus={displayedBus} />
        <BusActivityChart buses={buses} />
      </div>
    </div>
  );
}