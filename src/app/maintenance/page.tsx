import Header from '@/components/Header';
import MaintenanceTable from './components/MaintenanceTable';

// Ini adalah halaman utama untuk '/bus_stop/drivers'
export default function DriverManagementPage() {
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
        title="Manajemen Perawatan"
      />

      <MaintenanceTable />
    </div>
  );
}