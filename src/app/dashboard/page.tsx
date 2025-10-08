// src/app/dashboard/page.tsx
import StatsCard from "./components/StatsCard";
import MapView from "./components/MapView";
import DriverInfo from "./components/DriverInfo";
import BusTable from "./components/BusTable";
import PassengerChart from "./components/PassengerChart";
import BusDetail from "./components/BusDetail";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-primary font-semibold text-lg mb-1">Good Morning Admin!</p>
          <h1 className="text-4xl font-bold text-gray-800">Dashboard</h1>
        </div>
        <div className="w-14 h-14 bg-gradient-to-br from-primary to-blue-400 rounded-2xl flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 transition-transform">
          <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Active"
          count={5}
          label="Bus"
          icon="assets/icons/Maintenance.svg"
          gradient="from-blue-500 to-purple-500"
        />
        <StatsCard
          title="Non-Active"
          count={5}
          label="Bus"
          icon="assets/icons/Maintenance.svg"
          gradient="from-pink-500 to-red-500"
        />
        <StatsCard
          title="Maintenance"
          count={5}
          label="Bus"
          icon="assets/icons/Maintenance.svg"
          gradient="from-purple-900 to-purple-700"
        />
      </div>

      {/* Map and Bus List Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <MapView />
        </div>
        <div>
          <DriverInfo />
          <BusDetail />
        </div>
      </div>

      {/* Table and Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <BusTable />
        </div>
        <div>
          <PassengerChart />
        </div>
      </div>
    </div>
  );
}