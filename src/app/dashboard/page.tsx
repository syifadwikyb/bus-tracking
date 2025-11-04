// app/bus_stop/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { socket } from '@/lib/socket';
import StatsCard from './components/StatsCard';
import { BusFront, CircleOff, Wrench, CalendarClock } from 'lucide-react';
import dynamic from 'next/dynamic';
// Pastikan tipe Bus dan Stats diimpor dari DashboardClient
import type { Bus, Stats } from './DashboardClient'; 
import Header from '@/components/Header';
import { API_URL } from '@/lib/config';

// Tipe data mentah dari API (sekarang dari .../api/dashboard)
interface ApiBus {
  id_bus: number;
  kode_bus: string;
  plat_nomor: string;
  jenis_bus: string;
  status: string;
  latitude: number | string | null;
  longitude: number | string | null;
  penumpang: number;
  kapasitas: number;
  terakhir_dilihat: string | null;
  foto: string | null;
  jadwal: {
    status: string;
    driver: { nama: string, foto: string };
    jalur: { nama_jalur: string };
  }[];
}

// Tipe Stats yang BENAR (sesuai respons backend)
interface ApiStats {
  running: number;
  stopped: number;
  maintenance: number;
  scheduled: number;
}

// Fungsi konversi (sudah benar)
const convertApiBusToBus = (apiBus: ApiBus): Bus => {
  const jadwalAktif = apiBus.jadwal?.find(
    (j) => j.status?.toLowerCase() === "berjalan"
  ) || apiBus.jadwal?.[0];

  return {
    id_bus: apiBus.id_bus,
    kode_bus: apiBus.kode_bus,
    jenis_bus: apiBus.jenis_bus,
    status: apiBus.status,
    latitude: apiBus.latitude ? parseFloat(String(apiBus.latitude)) : null,
    longitude: apiBus.longitude ? parseFloat(String(apiBus.longitude)) : null,
    penumpang: apiBus.penumpang,
    kapasitas: apiBus.kapasitas,
    plat_nomor: apiBus.plat_nomor,
    nama: jadwalAktif?.driver?.nama || null,
    nama_jalur: jadwalAktif?.jalur?.nama_jalur || null,
    terakhir_dilihat: apiBus.terakhir_dilihat,
    foto: apiBus.foto,
    driver_foto: jadwalAktif?.driver?.foto || null
  };
};

const DashboardClient = dynamic(() => import('./DashboardClient'), {
  ssr: false,
  loading: () => <p>Memuat dashboard...</p>,
});

export default function Page() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [routes, setRoutes] = useState<any[]>([]);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // --- INI ADALAH FUNGSI fetchData YANG BENAR ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // HANYA PANGGIL ENDPOINT BARU (/) DAN ENDPOINT JALUR
        const [mainDataRes, routesRes] = await Promise.all([
          fetch(`${API_URL}/api/dashboard`), // <-- Memanggil endpoint gabungan
          fetch(`${API_URL}/api/jalur`),
        ]);

        if (!mainDataRes.ok || !routesRes.ok) {
          throw new Error('Gagal mengambil data awal');
        }

        const mainData = await mainDataRes.json();
        const routesData = await routesRes.json();
        
        // Ambil data dari respons gabungan
        const liveBusData: ApiBus[] = mainData.liveBuses;
        const statsData: ApiStats = mainData.stats; 
        
        const mappedBuses = liveBusData.map(convertApiBusToBus);

        // Langsung set stats dari backend (sekarang akan ada angkanya)
        setStats({
          active: statsData.running ?? 0,
          scheduled: statsData.scheduled ?? 0,
          nonActive: statsData.stopped ?? 0,
          maintenance: statsData.maintenance ?? 0,
        });

        setBuses(mappedBuses);
        setRoutes(routesData);

        if (mappedBuses.length > 0) {
          setSelectedBus(mappedBuses[0]);
        }

      } catch (error) {
        console.error('Gagal mengambil data dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_URL]); 
  // ----------------------------------------------------

  // --- useEffect Socket.IO (SUDAH BENAR) ---
  useEffect(() => {
    if (!socket.connected) socket.connect();

    const handleBusLocation = (data: { bus_id: number; latitude: number; longitude: number }) => {
      setBuses(prevBuses =>
        prevBuses.map(bus =>
          bus.id_bus === data.bus_id
            ? { ...bus, latitude: data.latitude, longitude: data.longitude, status: 'berjalan', terakhir_dilihat: new Date().toISOString() }
            : bus
        )
      );
      setSelectedBus(prevSelected =>
        prevSelected && prevSelected.id_bus === data.bus_id
          ? { ...prevSelected, latitude: data.latitude, longitude: data.longitude, status: 'berjalan', terakhir_dilihat: new Date().toISOString() }
          : prevSelected
      );
      
      // Update stats di frontend saat socket masuk (opsional)
      // Ini perlu logika lebih canggih, tapi untuk sementara:
      setStats(prevStats => {
         if (!prevStats) return null;
         return {
            ...prevStats,
            active: (prevStats.active || 0) + 1,
            nonActive: Math.max(0, (prevStats.nonActive || 0) - 1),
         }
      });
    };

    const handlePassengerUpdate = (data: { bus_id: number; passenger_count: number }) => {
      setBuses(prevBuses =>
        prevBuses.map(bus =>
          bus.id_bus === data.bus_id ? { ...bus, penumpang: data.passenger_count } : bus
        )
      );
      setSelectedBus(prevSelected =>
        prevSelected && prevSelected.id_bus === data.bus_id
          ? { ...prevSelected, penumpang: data.passenger_count }
          : prevSelected
      );
    };

    socket.on('bus_location', handleBusLocation);
    socket.on('passenger_update', handlePassengerUpdate);

    return () => {
      socket.off('bus_location', handleBusLocation);
      socket.off('passenger_update', handlePassengerUpdate);
    };
  }, []); // Array dependensi KOSONG sudah benar
  
  const handleRouteSelect = async (routeSummary: any | null) => {
    if (routeSummary) {
      try {
        const res = await fetch(`${API_URL}/api/jalur/${routeSummary.id_jalur}`);
        if (!res.ok) throw new Error('Gagal ambil detail jalur');
        const detailedRoute = await res.json();
        setSelectedRoute(detailedRoute);
      } catch (error) {
        console.error("Gagal fetch detail rute:", error);
        setSelectedRoute(null);
      }
    } else {
      setSelectedRoute(null);
    }
  };

  return (
    <div className="p-8">
      <Header />

      {/* Stats Cards (Nama key sudah benar) */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <StatsCard
          title="Running"
          count={stats?.active ?? 0} // 'active' = 'running'
          icon={<BusFront className="h-6 w-6" />}
          color="bg-gradient-to-r from-purple-500 to-indigo-600"
        />
        <StatsCard
          title="Scheduled"
          count={stats?.scheduled ?? 0}
          icon={<CalendarClock className="h-6 w-6" />}
          color="bg-gradient-to-r from-blue-400 to-cyan-500"
        />
        <StatsCard
          title="Stopped"
          count={stats?.nonActive ?? 0} // 'nonActive' = 'stopped'
          icon={<CircleOff className="h-6 w-6" />}
          color="bg-gradient-to-r from-orange-400 to-red-500"
        />
        <StatsCard
          title="Maintenance"
          count={stats?.maintenance ?? 0}
          icon={<Wrench className="h-6 w-6" />}
          color="bg-gradient-to-r from-gray-700 to-gray-900"
        />
      </div>

      <div className="mt-6">
        <DashboardClient
          buses={buses}
          routes={routes}
          selectedBus={selectedBus}
          onBusSelect={setSelectedBus}
          stats={stats}
          loading={loading}
          selectedRoute={selectedRoute}
          onRouteSelect={handleRouteSelect}
        />
      </div>
    </div>
  );
}