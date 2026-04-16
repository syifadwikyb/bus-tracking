'use client';
import Header from '@/components/Header';
import ScheduleTable from './components/ScheduleTable';
import { useEffect, useState } from 'react';

export default function ScheduleManagementPage() {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) setGreeting("Selamat Pagi Admin!");
    else if (hour >= 11 && hour < 15) setGreeting("Selamat Siang Admin!");
    else if (hour >= 15 && hour < 18) setGreeting("Selamat Sore Admin!");
    else setGreeting("Selamat Malam Admin!");
  }, []);

  return (
    <div className="p-8">
      <Header
        subtitle={greeting}
        title="Manajemen Penjadwalan" />

      <ScheduleTable />
    </div>
  );
}