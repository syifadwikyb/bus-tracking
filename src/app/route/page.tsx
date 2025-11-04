import Header from '@/components/Header';
import RouteTable from './components/RouteTable';

// Ini adalah halaman utama untuk '/bus_stop/route'
export default function RouteManagementPage() {
  return (
    // 'p-8' adalah padding keliling (sesuai desain)
    <div className="p-8">
      <Header/>
      <RouteTable />
    </div>
  );
}