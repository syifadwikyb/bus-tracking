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
  nama_jalur?: string;
  nama?: string;
  driver_foto?: string;
  jadwal: {
    id_schedule: number;
    jalur_id: number;
    driver_id: number;
    status: string;
    driver?: { nama: string; driver_foto: string };
  }[];
}

interface ApiStats {
  running: number;
  stopped: number;
  maintenance: number;
  scheduled: number;
}

// ✅ UPDATED: Menambahkan passenger_count sebagai optional
interface SocketLocationData {
  id_bus?: number;
  bus_id?: number;
  latitude: number;
  longitude: number;
  speed: number;
  status: string;
  passenger_count?: number;
  daftar_eta?: any[];
}

// --- FUNGSI KONVERSI ---
const convertApiBusToBus = (apiBus: ApiBus, routes: any[] = [], drivers: any[] = []): Bus => {
  const jadwalAktif = apiBus.jadwal?.find(
    (j) => j.status?.toLowerCase() === "berjalan"
  ) || apiBus.jadwal?.[0];

  // Cari nama_jalur dari routes berdasarkan jalur_id
  let nama_jalur: string | null = null;
  if (jadwalAktif?.jalur_id) {
    const matchedRoute = routes.find(r => r.id_jalur === jadwalAktif.jalur_id);
    nama_jalur = matchedRoute?.nama_jalur || null;
  }

  // Cari nama driver dari drivers berdasarkan driver_id
  let nama_driver: string | null = null;
  if (jadwalAktif?.driver_id) {
    const matchedDriver = drivers.find(d => d.id_driver === jadwalAktif.driver_id);
    nama_driver = matchedDriver?.nama || null;
  }

  // Fallback ke API data jika ada
  const finalNama = apiBus.nama || nama_driver || jadwalAktif?.driver?.nama || null;

  const convertedBus: Bus = {
    id_bus: apiBus.id_bus,
    kode_bus: apiBus.kode_bus,
    jenis_bus: apiBus.jenis_bus,
    status: apiBus.status,
    latitude: apiBus.latitude ? parseFloat(String(apiBus.latitude)) : null,
    longitude: apiBus.longitude ? parseFloat(String(apiBus.longitude)) : null,
    penumpang: apiBus.penumpang,
    kapasitas: apiBus.kapasitas,
    plat_nomor: apiBus.plat_nomor,
    nama: finalNama,
    nama_jalur: apiBus.nama_jalur || nama_jalur || null,
    terakhir_dilihat: apiBus.terakhir_dilihat,
    foto: apiBus.foto,
    driver_foto: apiBus.driver_foto || jadwalAktif?.driver?.driver_foto || null
  };
  
  return convertedBus;
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

  // 1. HITUNG STATISTIK DI SINI (LOGIKA FRONTEND)
  useEffect(() => {
    // Tunggu data terisi
    if (loading && buses.length === 0) return;

    const normalize = (s?: string) => s?.toLowerCase().trim() || '';

    const running = buses.filter(b => normalize(b.status) === 'berjalan').length;
    const scheduled = buses.filter(b => normalize(b.status) === 'dijadwalkan').length;
    const maintenance = buses.filter(b => normalize(b.status).includes('perbaikan')).length;

    // Hitung stopped berdasarkan sisa agar akurat
    const nonActive = buses.length - (running + scheduled + maintenance);

    setStats({
      active: running,
      scheduled,
      maintenance,
      nonActive: nonActive < 0 ? 0 : nonActive,
    });
  }, [buses, loading]);

  // 2. FETCH DATA AWAL (HTTP)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [mainDataRes, routesRes, driversRes] = await Promise.all([
          fetch(`${API_URL}/api/dashboard`),
          fetch(`${API_URL}/api/jalur`),
          fetch(`${API_URL}/api/drivers`),
        ]);

        if (!mainDataRes.ok || !routesRes.ok || !driversRes.ok) {
          throw new Error('Gagal mengambil data awal');
        }

        const mainData = await mainDataRes.json();
        const routesData = await routesRes.json();
        const driversData = await driversRes.json();

        const liveBusData: ApiBus[] = mainData.liveBuses;
        const mappedBuses = liveBusData.map(bus => convertApiBusToBus(bus, routesData, driversData));

        setBuses(mappedBuses);
        setRoutes(routesData);
      } catch (error) {
        console.error('Gagal mengambil data dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 3. SOCKET LISTENER (REAL-TIME: LOCATION & PASSENGER GABUNGAN)
  useEffect(() => {
    if (!socket.connected) socket.connect();

    // Handler Lokasi & Penumpang
    const handleBusLocation = (data: SocketLocationData) => {
      const targetId = data.id_bus || data.bus_id;
      if (!targetId) return;

      // Update State Daftar Bus
      setBuses((currentBuses) => {
        const exists = currentBuses.some(b => b.id_bus === targetId);
        if (!exists) return currentBuses;

        return currentBuses.map((bus) => {
          if (bus.id_bus === targetId) {
            return {
              ...bus,
              latitude: data.latitude,
              longitude: data.longitude,
              // ✅ Status otomatis 'berjalan' jika bergerak
              status: 'berjalan',
              terakhir_dilihat: new Date().toISOString(),
              // ✅ Update Penumpang (Jika dikirim backend, jika tidak pakai data lama)
              penumpang: (data.passenger_count !== undefined)
                ? data.passenger_count
                : bus.penumpang,
              daftar_eta: data.daftar_eta || bus.daftar_eta || []
            };
          }
          return bus;
        });
      });

      // Update Selected Bus (Popup Peta)
      setSelectedBus((prev) => {
        if (prev && prev.id_bus === targetId) {
          return {
            ...prev,
            latitude: data.latitude,
            longitude: data.longitude,
            status: 'berjalan',
            terakhir_dilihat: new Date().toISOString(),
            penumpang: (data.passenger_count !== undefined)
              ? data.passenger_count
              : prev.penumpang,
            daftar_eta: data.daftar_eta || prev.daftar_eta || []
          };
        }
        return prev;
      });
    };

    socket.on('bus_location', handleBusLocation);

    return () => {
      socket.off('bus_location', handleBusLocation);
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
          title="Berjalan"
          count={stats?.active ?? 0}
          icon={<BusFront className="h-6 w-6" />}
          color="bg-gradient-to-r from-purple-500 to-indigo-600"
        />
        <StatsCard
          title="Dijadwalkan"
          count={stats?.scheduled ?? 0}
          icon={<CalendarClock className="h-6 w-6" />}
          color="bg-gradient-to-r from-blue-400 to-cyan-500"
        />
        <StatsCard
          title="Berhenti"
          count={stats?.nonActive ?? 0}
          icon={<CircleOff className="h-6 w-6" />}
          color="bg-gradient-to-r from-orange-400 to-red-500"
        />
        <StatsCard
          title="Perbaikan"
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