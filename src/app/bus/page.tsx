import Header from '@/components/Header';
import BusTable from './components/BusTable';

// Ini adalah halaman utama untuk '/bus_stop/bus'
export default function BusManagementPage() {
    return (
        // 'p-8' adalah padding keliling (sesuai desain)
        <div className="p-8">
            <Header />

            <BusTable />
        </div>
    );
}
