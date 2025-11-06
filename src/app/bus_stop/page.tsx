import Header from '@/components/Header';
import BusStopTable from './components/BusStopTable';

// Ini adalah halaman utama untuk '/bus_stop/drivers'
export default function BusStopManagementPage() {
  return (
    // 'p-8' adalah padding keliling (sesuai desain)
    <div className="p-8">
      <Header />

      {/* 2. Konten Utama (Tabel) */}
      <BusStopTable />
    </div>
  );
}