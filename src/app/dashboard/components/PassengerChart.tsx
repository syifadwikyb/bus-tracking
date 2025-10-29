"use client";
import { type Bus } from '../DashboardClient';

type ChartProps = {
  bus: Bus | null;
};

export default function PassengerChart({ bus }: ChartProps) {
  const data = {
    labels: ['08:00', '09:00', '10:00', '11:00', '12:00'],
    datasets: [
      {
        label: 'Jumlah Penumpang',
        data: bus ? [5, 12, 8, 15, 10] : [0, 0, 0, 0, 0], // Ganti dengan data asli
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: { y: { beginAtZero: true } }
  } as const; // 'as const' untuk memperbaiki error tipe Chart.js

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4">
        Chart Penumpang Bus
      </h3>
      <p className="text-gray-600 mb-4">
        {bus ? bus.plat_nomor : "Pilih bus untuk melihat chart"}
      </p>

      {/* Ganti <div> ini dengan komponen <Bar> Anda */}
      <div className="h-[250px] flex items-center justify-center bg-gray-50 rounded">
        {/* <Bar options={options} data={data} /> */}
        <p className="text-gray-400">Chart akan tampil di sini</p>
      </div>
    </div>
  );
}