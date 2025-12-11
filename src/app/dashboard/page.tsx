// app/bus_stop/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { socket } from '@/lib/socket';
import StatsCard from './components/StatsCard';
import { BusFront, CircleOff, Wrench, CalendarClock } from 'lucide-react';
import dynamic from 'next/dynamic';
import type { Bus, Stats } from './DashboardClient';
import Header from '@/components/Header';
import { API_URL } from '@/lib/config';

// --- TIPE DATA ---
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

interface ApiStats {
  running: number;
  stopped: number;
  maintenance: number;
  scheduled: number;
}

// Interface Payload Socket
interface SocketLocationData {
  id_bus?: number; // Backend mungkin kirim ini
  bus_id?: number; // Atau ini
  latitude: number;
  longitude: number;
  speed: number;
  status: string;
}

interface SocketPassengerData {
  id_bus?: number;
  bus_id?: number;
  passenger_count: number;
}

// --- FUNGSI KONVERSI ---
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

// Import Dynamic Dashboard Client
const DashboardClient = dynamic(() => import('./DashboardClient'), {
  ssr: false,
  loading: () => <div className="p-4 text-center">Memuat komponen dashboard...</div>,
});

export default function Page() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [routes, setRoutes] = useState<any[]>([]);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. FETCH DATA AWAL (HTTP)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [mainDataRes, routesRes] = await Promise.all([
          fetch(`${API_URL}/api/dashboard`),
          fetch(`${API_URL}/api/jalur`),
        ]);

        if (!mainDataRes.ok || !routesRes.ok) {
          throw new Error('Gagal mengambil data awal');
        }

        const mainData = await mainDataRes.json();
        const routesData = await routesRes.json();

        const liveBusData: ApiBus[] = mainData.liveBuses;
        const statsData: ApiStats = mainData.stats;

        const mappedBuses = liveBusData.map(convertApiBusToBus);

        setBuses(mappedBuses);
        setRoutes(routesData);

        // Set stats awal dari database
        setStats({
          active: statsData.running ?? 0,
          scheduled: statsData.scheduled ?? 0,
          nonActive: statsData.stopped ?? 0,
          maintenance: statsData.maintenance ?? 0,
        });

      } catch (error) {
        console.error('Gagal mengambil data dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 2. SOCKET LISTENER (REAL-TIME)
  useEffect(() => {
    if (!socket.connected) socket.connect();

    // Handler Lokasi
    const handleBusLocation = (data: SocketLocationData) => {
      // Pastikan kita menangkap ID yang benar (backend kirim id_bus atau bus_id)
      const targetId = data.id_bus || data.bus_id;
      if (!targetId) return;

      setBuses((currentBuses) => {
        // Cek apakah bus ada di list
        const exists = currentBuses.some(b => b.id_bus === targetId);

        if (!exists) return currentBuses; // Jika bus baru (tidak ada di DB awal), abaikan dulu agar aman

        // Update bus yang sesuai (IMMUTABLE UPDATE - Tidak menambah array)
        const updatedBuses = currentBuses.map((bus) => {
          if (bus.id_bus === targetId) {
            return {
              ...bus,
              latitude: data.latitude,
              longitude: data.longitude,
              // KUNCI PERBAIKAN: Paksa status jadi 'berjalan' karena menerima data lokasi
              status: 'berjalan',
              terakhir_dilihat: new Date().toISOString()
            };
          }
          return bus;
        });

        // HITUNG ULANG STATS DI SINI (Supaya akurat dan tidak nambah terus)
        const runningCount = updatedBuses.filter(b => b.status === 'berjalan').length;
        // Bus berhenti adalah bus yang tidak berjalan & tidak maintenance
        const stoppedCount = updatedBuses.filter(b => b.status !== 'berjalan' && b.status !== 'dalam perbaikan').length;

        setStats(prevStats => {
          if (!prevStats) return null;
          return {
            ...prevStats,
            active: runningCount,
            nonActive: stoppedCount
            // maintenance & scheduled tetap pakai nilai lama karena tidak berubah realtime via lokasi
          };
        });

        return updatedBuses;
      });

      // Update juga selectedBus jika sedang dipilih agar popup di peta ikut berubah
      setSelectedBus((prev) => {
        if (prev && prev.id_bus === targetId) {
          return {
            ...prev,
            latitude: data.latitude,
            longitude: data.longitude,
            status: 'berjalan',
            terakhir_dilihat: new Date().toISOString()
          };
        }
        return prev;
      });
    };

    // Handler Penumpang
    const handlePassengerUpdate = (data: SocketPassengerData) => {
      const targetId = data.id_bus || data.bus_id;
      if (!targetId) return;

      setBuses(prevBuses =>
        prevBuses.map(bus =>
          bus.id_bus === targetId ? { ...bus, penumpang: data.passenger_count } : bus
        )
      );

      setSelectedBus(prevSelected =>
        prevSelected && prevSelected.id_bus === targetId
          ? { ...prevSelected, penumpang: data.passenger_count }
          : prevSelected
      );
    };

    socket.on('bus_location', handleBusLocation); // Pastikan nama event sama dengan backend (emitBusUpdate)
    socket.on('passenger_update', handlePassengerUpdate);

    return () => {
      socket.off('bus_location', handleBusLocation);
      socket.off('passenger_update', handlePassengerUpdate);
    };
  }, []);

  // Handler Pilih Rute
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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) return "Selamat Pagi Admin!";
    if (hour >= 11 && hour < 15) return "Selamat Siang Admin!";
    if (hour >= 15 && hour < 18) return "Selamat Sore Admin!";
    return "Selamat Malam Admin!";
  };

  return (
    <div className="p-8">
      <Header
        subtitle={getGreeting()}
        title="Dasbor"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <StatsCard
          title="Running"
          count={stats?.active ?? 0}
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
          count={stats?.nonActive ?? 0}
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