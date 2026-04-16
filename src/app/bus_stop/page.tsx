'use client';
import Header from '@/components/Header';
import BusStopTable from './components/BusStopTable';
import { useEffect, useState } from 'react';

export default function BusStopManagementPage() {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 11) setGreeting("Selamat Pagi Admin!");
    if (hour >= 11 && hour < 15) setGreeting("Selamat Siang Admin!");
    if (hour >= 15 && hour < 18) setGreeting("Selamat Sore Admin!");
    setGreeting("Selamat Malam Admin!");
  }, []);

  return (
    <div className="p-8">
      <Header
        subtitle={greeting}
        title="Manajemen Halte"
      />

      <BusStopTable />
    </div>
  );
}