'use client';

import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { API_URL } from '@/lib/config';

// Registrasi ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ActivityData {
  tanggal: string;
  max_penumpang: number;
  avg_penumpang: number;
}

interface BusSimple {
    id_bus: number;
    plat_nomor: string;
}

export default function BusActivityChart({ buses }: { buses: any[] }) {
  const [chartData, setChartData] = useState<ActivityData[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedBusId, setSelectedBusId] = useState('');

  // Set default tanggal (7 hari terakhir) saat pertama load
  useEffect(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 7);
    
    setEndDate(end.toISOString().split('T')[0]);
    setStartDate(start.toISOString().split('T')[0]);
  }, []);

  // Fetch Data setiap kali filter berubah
  useEffect(() => {
    if (!startDate || !endDate) return;
    fetchData();
  }, [startDate, endDate, selectedBusId]);

  const fetchData = async () => {
    try {
      const query = new URLSearchParams({
        startDate,
        endDate,
        ...(selectedBusId && { busId: selectedBusId })
      });

      const res = await fetch(`${API_URL}/api/dashboard/activity?${query}`);
      const data = await res.json();
      setChartData(data);
    } catch (error) {
      console.error("Gagal ambil data aktivitas:", error);
    }
  };

  // Konfigurasi Data Chart
  const data = {
    labels: chartData.map(d => new Date(d.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })),
    datasets: [
      {
        label: 'Maksimal Penumpang',
        data: chartData.map(d => d.max_penumpang),
        borderColor: 'rgb(59, 130, 246)', // Biru
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Rata-rata Penumpang',
        data: chartData.map(d => d.avg_penumpang),
        borderColor: 'rgb(34, 197, 94)', // Hijau
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        borderDash: [5, 5], // Garis putus-putus
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: false },
    },
    scales: {
        y: { beginAtZero: true }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h3 className="text-lg font-semibold text-gray-800">Aktivitas Penumpang</h3>
        
        {/* Filter Controls */}
        <div className="flex flex-wrap gap-2 items-center">
            {/* Pilih Bus */}
            <select 
                className="border rounded px-2 py-1 text-sm bg-gray-50"
                value={selectedBusId}
                onChange={(e) => setSelectedBusId(e.target.value)}
            >
                <option value="">Semua Bus</option>
                {buses.map((b) => (
                    <option key={b.id_bus} value={b.id_bus}>{b.plat_nomor}</option>
                ))}
            </select>

            {/* Input Tanggal */}
            <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border rounded px-2 py-1 text-sm"
            />
            <span className="text-gray-400">-</span>
            <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border rounded px-2 py-1 text-sm"
            />
        </div>
      </div>

      <div className="h-64 w-full">
        {chartData.length > 0 ? (
            <Line options={options} data={data} />
        ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
                Tidak ada data pada rentang tanggal ini
            </div>
        )}
      </div>
    </div>
  );
}