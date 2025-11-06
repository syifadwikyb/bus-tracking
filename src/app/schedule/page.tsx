import Header from '@/components/Header'; // Asumsi path ini benar
import ScheduleTable from './components/ScheduleTable'; // Path ke komponen baru

// Ini adalah halaman utama untuk '/schedule'
export default function ScheduleManagementPage() {
  return (
    <div className="p-8">
      {/* 1. Header Halaman */}
      <Header/>

      {/* 2. Konten Utama (Tabel) */}
      <div className="mt-8">
        <ScheduleTable />
      </div>
    </div>
  );
}