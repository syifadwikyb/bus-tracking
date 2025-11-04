import Header from '@/components/Header';
import DriverTable from './components/DriverTable';

// Ini adalah halaman utama untuk '/bus_stop/drivers'
export default function DriverManagementPage() {
  return (
    // 'p-8' adalah padding keliling (sesuai desain)
    <div className="p-8">
      <Header />

      {/* 2. Konten Utama (Tabel) */}
      <DriverTable />
    </div>
  );
}