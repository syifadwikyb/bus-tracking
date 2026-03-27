"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { type Bus } from "../DashboardClient";
import { API_URL } from '@/lib/config';

type BusDetailProps = {
  bus: Bus | null;
};

const DetailRow = ({
  label,
  value,
  isStatus = false,
}: {
  label: string;
  value: string | number | null | undefined;
  isStatus?: boolean;
}) => (
  <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
    <span className="text-sm text-gray-500">{label}</span>
    {isStatus ? (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize
        ${String(value).toLowerCase() === 'berjalan' ? 'bg-green-100 text-green-700' :
          String(value).toLowerCase() === 'dalam perbaikan' ? 'bg-yellow-100 text-yellow-700' :
            'bg-gray-100 text-gray-600'}`}>
        {value || "N/A"}
      </span>
    ) : (
      <span className="font-medium text-sm text-gray-900 text-right">{value || "-"}</span>
    )}
  </div>
);

export default function BusDetail({ bus }: BusDetailProps) {
  const [imgSrc, setImgSrc] = useState("/assets/icons/bus-placeholder.svg");
  const [activeTab, setActiveTab] = useState<'detail' | 'prediksi'>('detail');

  useEffect(() => {
    if (bus?.foto) {
      const url = bus.foto.startsWith("http") ? bus.foto : `${API_URL}/uploads/${bus.foto}`;
      setImgSrc(url);
    } else {
      setImgSrc("/assets/icons/bus-placeholder.svg");
    }
  }, [bus]);

  if (!bus || bus.id_bus === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center min-h-[300px]">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">🚌</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-800">Detail & Prediksi Bus</h3>
        <p className="text-sm text-gray-500 mt-2">
          Pilih bus dari peta atau tabel<br />untuk melihat detail lengkap.
        </p>
      </div>
    );
  }

  const formatDistance = (meters: number) => {
    if (meters < 1000) return `${meters} m`;
    return `${(meters / 1000).toFixed(1)} km`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden w-full">

      {/* --- MENU TABS --- */}
      <div className="flex border-b border-gray-200 bg-gray-50/50">
        <button
          onClick={() => setActiveTab('detail')}
          className={`flex-1 py-3.5 text-sm font-semibold text-center border-b-2 transition-colors duration-200 ${activeTab === 'detail'
              ? 'border-blue-600 text-blue-700 bg-white'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
        >
          Detail Bus
        </button>
        <button
          onClick={() => setActiveTab('prediksi')}
          className={`flex-1 py-3.5 text-sm font-semibold text-center border-b-2 transition-colors duration-200 ${activeTab === 'prediksi'
              ? 'border-blue-600 text-blue-700 bg-white'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
        >
          Prediksi Kedatangan
        </button>
      </div>

      {/* --- KONTEN TABS --- */}
      <div className="p-6">

        {/* Konten 1: DETAIL BUS */}
        {/* Menggunakan class 'block' dan 'hidden' agar lebih aman di Next.js */}
        <div className={`${activeTab === 'detail' ? 'block' : 'hidden'}`}>
          <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden mb-6 border border-gray-200">
            <Image
              src={imgSrc}
              alt={`Bus ${bus.plat_nomor}`}
              fill
              className="object-cover"
              onError={() => setImgSrc("/assets/icons/bus-placeholder.svg")}
              sizes="(max-width: 768px) 100vw, 300px"
              priority
            />
          </div>

          <div className="flex flex-col">
            <DetailRow label="Nomor Polisi" value={bus.plat_nomor} />
            <DetailRow label="Kode Bus" value={bus.kode_bus} />
            <DetailRow label="Jalur" value={bus.nama_jalur} />
            <DetailRow label="Jenis Bus" value={bus.jenis_bus} />
            <DetailRow label="Status Operasional" value={bus.status} isStatus />
          </div>
        </div>

        {/* Konten 2: PREDIKSI KEDATANGAN */}
        {/* max-h-[400px] mencegah tab kepanjangan, overflow-y-auto memunculkan scroll */}
        <div className={`${activeTab === 'prediksi' ? 'block' : 'hidden'} max-h-[400px] overflow-y-auto pr-2`}>
          {!bus.daftar_eta || bus.daftar_eta.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center text-gray-500">
              <span className="text-4xl mb-4 opacity-50">⏳</span>
              <p className="text-sm">Prediksi rute belum tersedia atau<br />bus sedang tidak beroperasi.</p>
            </div>
          ) : (
            <div className="relative border-l-2 border-blue-200 ml-4 mt-2">
              {bus.daftar_eta.map((eta: any, index: number) => {
                
                // HANYA halte yang sedang dituju yang menjadi biru
                const isTarget = eta.is_target; 
                const etaMinutes = eta.eta_seconds ? Math.ceil(eta.eta_seconds / 60) : 0;

                return (
                  <div key={eta.halte_id || index} className="mb-6 ml-6 relative">

                    {/* Lingkaran Titik Timeline */}
                    <span className={`absolute flex items-center justify-center w-4 h-4 rounded-full -left-[1.95rem] ring-4 ring-white transition-colors duration-300
                      ${isTarget ? 'bg-blue-600 shadow-sm' : 'bg-gray-300'}`}>
                    </span>

                    <div className="flex justify-between items-start bg-white">
                      <div className="pr-3">
                        <h4 className={`text-sm font-semibold transition-colors duration-300 ${isTarget ? 'text-blue-700' : 'text-gray-700'}`}>
                          {eta.nama_halte}
                        </h4>
                        
                        <p className="text-xs text-gray-500 mt-1">
                           Berjarak {formatDistance(eta.distance_meters)}
                        </p>
                      </div>

                      {/* Kotak Waktu */}
                      <div className={`text-right shrink-0 transition-all duration-300 ${isTarget ? 'bg-blue-50 px-3 py-1.5 rounded-md border border-blue-100' : 'py-1.5'}`}>
                        <span className={`text-sm font-bold ${isTarget ? 'text-blue-700' : 'text-gray-600'}`}>
                          {eta.eta_seconds === null ? '...' : (etaMinutes < 1 ? '< 1 Menit' : `${etaMinutes} Menit`)}
                        </span>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}