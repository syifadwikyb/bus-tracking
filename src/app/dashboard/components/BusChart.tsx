'use client';

import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { API_URL } from '@/lib/config';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface UtilizationData {
  id_bus: number;
  plat_nomor: string;
  total_logs: number;
  active_minutes: number;
}

export default function BusChart() {
  const [chartData, setChartData] = useState<UtilizationData[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 7); // Default 7 hari
    
    setEndDate(end.toISOString().split('T')[0]);
    setStartDate(start.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    if (!startDate || !endDate) return;
    fetchData();
  }, [startDate, endDate]);

  const fetchData = async () => {
    try {
      const query = new URLSearchParams({ startDate, endDate });
      const res = await fetch(`${API_URL}/api/dashboard/utilization?${query}`);
      const data = await res.json();
      setChartData(data);
    } catch (error) {
      console.error("Gagal ambil data utilitas:", error);
    }
  };

  // Konfigurasi Chart
  const data = {
    labels: chartData.map(d => d.plat_nomor), // Label bawah: Plat Nomor
    datasets: [
      {
        label: 'Durasi Operasional (Menit)',
        data: chartData.map(d => d.active_minutes),
        backgroundColor: chartData.map(d => {
            // Warnai Merah jika pemakaian sangat rendah (< 10 menit) -> Indikasi Jarang Dipakai
            if (d.active_minutes < 10) return 'rgba(239, 68, 68, 0.7)'; 
            // Warnai Biru Normal
            return 'rgba(59, 130, 246, 0.7)';
        }),
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { 
        display: true, 
        text: 'Perbandingan Jam Terbang Bus' 
      },
      tooltip: {
        callbacks: {
            label: (context: any) => {
                const val = context.raw;
                return `Aktif: ${val} Menit (~${(val/60).toFixed(1)} Jam)`;
            }
        }
      }
    },
    scales: {
        y: { 
            beginAtZero: true,
            title: { display: true, text: 'Menit Aktif' }
        }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
            <h3 className="text-lg font-semibold text-gray-800">Utilisasi Armada Bus</h3>
            <p className="text-sm text-gray-500">Pantau keseimbangan pemakaian armada</p>
        </div>
        
        {/* Filter Tanggal */}
        <div className="flex items-center gap-2">
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
            <Bar options={options} data={data} />
        ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
                Memuat data...
            </div>
        )}
      </div>
      
      {/* Legend Manual untuk info tambahan */}
      <div className="mt-4 flex gap-4 text-xs text-gray-500 justify-center">
        <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
            <span>Aktif Normal</span>
        </div>
        <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
            <span>Jarang Digunakan</span>
        </div>
      </div>
    </div>
  );
}