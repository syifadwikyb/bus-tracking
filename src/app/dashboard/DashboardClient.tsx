'use client';

import { useMemo } from 'react'; // Import useMemo
import MapView from './components/MapView';
import BusTable from './components/BusTable';
import DriverInfo from './components/DriverInfo';
import BusDetail from './components/BusDetail';
import BusChart from './components/BusChart';

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
  eta_seconds?: number;
  distance_to_next_halte?: number;
  next_halte_id?: number;
  daftar_eta?: any[];
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

  const activeBuses = useMemo(() => {
    return buses.filter((bus) => {
      const status = bus.status?.toLowerCase();
      return status === 'berjalan' && bus.latitude && bus.longitude;
    });
  }, [buses]);

  const emptyBus: Bus = {
    id_bus: 0, kode_bus: "-", plat_nomor: "-", jenis_bus: "-", status: "-",
    latitude: null, longitude: null, penumpang: 0, kapasitas: 0,
    nama: "-", nama_jalur: "-", terakhir_dilihat: "-", foto: null, driver_foto: null
  };

  const displayedBus = selectedBus ?? emptyBus;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 flex flex-col gap-6">
        
        {/* MAP SECTION */}
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Peta Tracking Real-time</h3>
            
            <select
              onChange={(e) => {
                const routeId = e.target.value ? parseInt(e.target.value) : null;
                const routeSummary = routes.find(r => r.id_jalur === routeId);
                onRouteSelect(routeSummary || null);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Semua Rute</option>
              {routes.map(route => (
                <option key={route.id_jalur} value={route.id_jalur}>
                  {route.nama_jalur}
                </option>
              ))}
            </select>
          </div>

          <div className="h-[450px] w-full rounded-lg overflow-hidden border border-gray-200 relative z-0">
            <MapView
              buses={buses}
              selectedRoute={selectedRoute}
              onBusClick={onBusSelect}
            />
          </div>
        </div>

        {/* TABLE SECTION */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-700">
              Armada Beroperasi ({activeBuses.length})
            </h3>
          </div>
          <BusTable buses={activeBuses} onRowClick={onBusSelect} />
        </div>
      </div>

      {/* DETAIL & CHART */}
      <div className="flex flex-col gap-6">
        <DriverInfo bus={displayedBus} />
        <BusDetail bus={displayedBus} />
        <BusChart /> 
      </div>
    </div>
  );
}