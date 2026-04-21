'use client';

import { useEffect, useState } from 'react';
import StatsCard from './components/StatsCard';
import { BusFront, CircleOff, Wrench, CalendarClock } from 'lucide-react';
import dynamic from 'next/dynamic';
import type { Bus, Stats } from './DashboardClient';
import Header from '@/components/Header';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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

interface LocationData {
  id_bus?: number;
  bus_id?: number;
  latitude: number;
  longitude: number;
  speed: number;
  status: string;
  passenger_count?: number;
  daftar_eta?: any[];
}

type BusLocation = {
  bus_id: number;
  latitude: number | string;
  longitude: number | string;
  speed: number;
};

const convertApiBusToBus = (apiBus: ApiBus, routes: any[] = [], drivers: any[] = []): Bus => {
  const jadwalAktif = apiBus.jadwal?.find(
    (j) => j.status?.toLowerCase() === "berjalan"
  ) || apiBus.jadwal?.[0];

  let nama_jalur: string | null = null;
  if (jadwalAktif?.jalur_id) {
    const matchedRoute = routes.find(r => r.id_jalur === jadwalAktif.jalur_id);
    nama_jalur = matchedRoute?.nama_jalur || null;
  }

  let nama_driver: string | null = null;
  let driver_foto: string | null = null;
  if (jadwalAktif?.driver_id) {
    const matchedDriver = drivers.find(d => d.id_driver === jadwalAktif.driver_id);
    nama_driver = matchedDriver?.nama || null;
    driver_foto = matchedDriver?.driver_foto || null;
  }

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
    driver_foto: apiBus.driver_foto || jadwalAktif?.driver?.driver_foto || driver_foto || null
  };

  return convertedBus;
};

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

  useEffect(() => {
    if (loading && buses.length === 0) return;

    const normalize = (s?: string) => s?.toLowerCase().trim() || '';

    const running = buses.filter(b => normalize(b.status) === 'berjalan').length;
    const scheduled = buses.filter(b => normalize(b.status) === 'dijadwalkan').length;
    const maintenance = buses.filter(b => normalize(b.status).includes('perbaikan')).length;

    const nonActive = buses.length - (running + scheduled + maintenance);

    setStats({
      active: running,
      scheduled,
      maintenance,
      nonActive: nonActive < 0 ? 0 : nonActive,
    });
  }, [buses, loading]);

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

  // Contoh di useEffect React/Next.js
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rest/bus-location`);
        const result = await res.json();

        if (result.data) {
          setBuses(prevBuses =>
            prevBuses.map(bus => {
              // Cari apakah ada data lokasi baru untuk bus ini
              const update = result.data.find((u: any) => u.bus_id === bus.id_bus);
              if (update) {
                return {
                  ...bus,
                  latitude: parseFloat(update.latitude),
                  longitude: parseFloat(update.longitude),
                  speed: update.speed,
                  status: update.speed > 0 ? 'berjalan' : bus.status // update status jika perlu
                };
              }
              return bus;
            })
          );
        }
      } catch (err) {
        console.error("Gagal update lokasi:", err);
      }
    };

    const interval = setInterval(fetchLocations, 3000);
    return () => clearInterval(interval);
  }, []);

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