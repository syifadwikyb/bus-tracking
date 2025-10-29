// app/bus_stop/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { socket } from '@/lib/socket';
import StatsCard from './components/StatsCard';
import ProfileCard from './components/ProfileCard';
import { BusFront, CircleOff, Wrench } from 'lucide-react';
import dynamic from 'next/dynamic';
import type { Bus, Stats } from './DashboardClient';

// Tipe data mentah dari API /api/dashboard/live-bus
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
    status: string; // <-- Pastikan backend mengirim status jadwal
    driver: { nama: string, foto: string };
    jalur: { nama_jalur: string };
  }[];
}

const convertApiBusToBus = (apiBus: ApiBus): Bus => {
  const jadwalAktif = apiBus.jadwal?.find(
    (j) => j.status?.toLowerCase() === "berjalan"
  ) || apiBus.jadwal?.[0]; // Fallback ke jadwal pertama

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
    nama: jadwalAktif?.driver?.nama || null, // Nama driver
    nama_jalur: jadwalAktif?.jalur?.nama_jalur || null, // Nama jalur
    terakhir_dilihat: apiBus.terakhir_dilihat,
    foto: apiBus.foto, // Foto bus
    driver_foto: jadwalAktif?.driver?.foto || null // Foto driver
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

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Ambil data bus dan rute terlebih dahulu
        const [liveBusRes, routesRes, statsRes] = await Promise.all([
          fetch(`${API_URL}/api/dashboard/live-bus`),
          fetch(`${API_URL}/api/jalur`),
          fetch(`${API_URL}/api/dashboard/stats`), // Kita tetap ambil 'maintenance'
        ]);

        if (!liveBusRes.ok || !routesRes.ok || !statsRes.ok) {
          throw new Error('Gagal mengambil data awal');
        }

        const liveBusData: ApiBus[] = await liveBusRes.json();
        const routesData = await routesRes.json();
        const statsData = await statsRes.json(); // Data maintenance

        const mappedBuses = liveBusData.map(convertApiBusToBus);

        // =================================================================
        // ⚠️ PERBAIKAN 2: Mengatasi Race Condition ⚠️
        // Hitung statistik 'active' dan 'nonActive' dari data live
        // =================================================================
        const activeCount = mappedBuses.filter(
          (bus) => bus.status === 'berjalan'
        ).length;

        const nonActiveCount = mappedBuses.filter(
          (bus) => bus.status === 'berhenti'
        ).length;

        // Gabungkan dengan data maintenance dari API
        setStats({
          active: activeCount,
          nonActive: nonActiveCount,
          maintenance: statsData?.maintenance ?? 0,
        });
        // =================================================================

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

  // 2. Setup Socket.IO listeners
  useEffect(() => {
    if (!socket.connected) socket.connect();

    const handleBusLocation = (data: { bus_id: number; latitude: number; longitude: number }) => {
      setBuses(prevBuses =>
        prevBuses.map(bus =>
          bus.id_bus === data.bus_id
            ? { ...bus, latitude: data.latitude, longitude: data.longitude, status: 'berjalan', terakhir_dilihat: new Date().toISOString() } // <-- Menggunakan 'berjalan'
            : bus
        )
      );

      setSelectedBus(prevSelected =>
        prevSelected && prevSelected.id_bus === data.bus_id
          ? { ...prevSelected, latitude: data.latitude, longitude: data.longitude, status: 'berjalan', terakhir_dilihat: new Date().toISOString() } // <-- Menggunakan 'berjalan'
          : prevSelected
      );

      // Update stats state saat ada update socket
      setStats(prevStats => {
        const activeCount = buses.filter(b => b.status === 'berjalan').length;
        const nonActiveCount = buses.filter(b => b.status === 'berhenti').length;
        return {
          active: activeCount,
          nonActive: nonActiveCount,
          maintenance: prevStats?.maintenance ?? 0
        };
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
  }, [buses]); // <-- Tambahkan 'buses' sebagai dependensi

  // ... (Handler handleRouteSelect tetap sama)
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
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Good Morning Admin!</h1>
          <h2 className="text-4xl font-extrabold text-gray-900">Dashboard</h2>
        </div>
        <ProfileCard />
      </header>

      {/* Stats Cards (Sekarang akan menampilkan data yang benar) */}
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatsCard
          title="Walk"
          count={stats?.active ?? 0}
          icon={<BusFront className="h-6 w-6" />}
          color="bg-gradient-to-r from-purple-500 to-indigo-600"
        />
        <StatsCard
          title="Stop"
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

      {/* DashboardClient */}
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