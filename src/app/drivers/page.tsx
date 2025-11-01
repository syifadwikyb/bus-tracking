import DriverTable from './components/DriverTable';

// Ini adalah halaman utama untuk '/bus_stop/drivers'
export default function DriverManagementPage() {
  return (
    // 'p-8' adalah padding keliling (sesuai desain)
    <div className="p-8">
      {/* 1. Header */}
      <header className="mb-6">
        <h3 className="text-lg font-medium text-gray-600">Good Morning Admin!</h3>
        <h2 className="text-3xl font-bold text-gray-900">Management Drivers</h2>
      </header>

      {/* 2. Konten Utama (Tabel) */}
      <DriverTable />
    </div>
  );
}