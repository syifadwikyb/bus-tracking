import RouteTable from './components/RouteTable';

// Ini adalah halaman utama untuk '/bus_stop/route'
export default function RouteManagementPage() {
  return (
    // 'p-8' adalah padding keliling (sesuai desain)
    <div className="p-8">
      {/* 1. Header */}
      <header className="mb-6">
        <h3 className="text-lg font-medium text-gray-600">Good Morning Admin!</h3>
        <h2 className="text-3xl font-bold text-gray-900">Management Route</h2>
      </header>

      {/* 2. Konten Utama (Tabel) */}
      {/* Semua logika (fetch, search, filter, pagination) ada 
        di dalam RouteTable untuk menjaga 'page' ini tetap bersih.
      */}
      <RouteTable />
    </div>
  );
}