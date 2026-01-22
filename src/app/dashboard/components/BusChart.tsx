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
    start.setDate(end.getDate() - 7);

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


  const data = {
    labels: chartData.map(d => d.plat_nomor),
    datasets: [
      {
        label: 'Durasi (Menit)',
        data: chartData.map(d => d.active_minutes),
        backgroundColor: chartData.map(d => {
          if (d.active_minutes < 10) return 'rgba(239, 68, 68, 0.7)';
          return 'rgba(59, 130, 246, 0.7)';
        }),
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          boxWidth: 10,
          font: { size: 12 }
        }
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const val = context.raw;
            return `Aktif: ${val} Menit (~${(val / 60).toFixed(1)} Jam)`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Menit Aktif' },
        ticks: { maxTicksLimit: 6 }
      },
      x: {
        ticks: {
          autoSkip: false,
          maxRotation: 45,
          minRotation: 45
        }
      }
    }
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-md w-full">
      {/* Header & Filter Section */}
      <div className="md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Utilisasi Armada</h3>
        </div>

        {/* Filter Tanggal Responsive */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full md:w-auto bg-gray-50 p-2 rounded-lg border border-gray-100">
          <div className="w-full sm:w-auto">
            <span className="text-xs text-gray-400 block sm:hidden mb-1">Dari:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm w-full md:w-auto focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>

          <span className="hidden sm:block text-gray-400">-</span>

          <div className="w-full sm:w-auto">
            <span className="text-xs text-gray-400 block sm:hidden mb-1">Sampai:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1.5 text-sm w-full sm:w-auto focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Chart Container Responsive */}
      {/* Tinggi 300px di HP, 400px di Tablet/Desktop */}
      <div className="relative w-full h-[300px] md:h-[400px]">
        {chartData.length > 0 ? (
          <Bar options={options} data={data} />
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2">
            <div className="animate-pulse bg-gray-200 h-8 w-8 rounded-full"></div>
            <span className="text-sm">Memuat data...</span>
          </div>
        )}
      </div>

      {/* Legend Manual */}
      <div className="mt-6 flex flex-wrap gap-4 text-xs text-gray-600 justify-center bg-gray-50 p-2 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-sm shadow-sm"></div>
          <span>Normal</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-sm shadow-sm"></div>
          <span>Jarang Pakai (&lt;10 mnt)</span>
        </div>
      </div>
    </div>
  );
}