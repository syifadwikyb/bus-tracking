"use client";

import { useState, useEffect } from "react";
import { type Bus } from "../DashboardClient"; // Sesuaikan path ini jika berbeda
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
  const [imgSrc, setImgSrc] = useState("/assets/icons/bus.svg");

  useEffect(() => {
    if (!bus) {
      setImgSrc("/assets/icons/bus.svg");
      return;
    }

    const imageName = bus.foto || bus.driver_foto;
    if (imageName) {
      const url = String(imageName).startsWith("http")
        ? String(imageName)
        : `${API_URL}/uploads/${imageName}`;
      setImgSrc(url);
    } else {
      setImgSrc("/assets/icons/bus.svg");
    }
  }, [bus]);

  // Tampilan Placeholder Jika Bus Belum Dipilih
  if (!bus || bus.id_bus === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center min-h-[300px]">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">🚌</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-800">Detail Bus</h3>
        <p className="text-sm text-gray-500 mt-2">
          Pilih bus dari peta atau tabel<br />untuk melihat detail lengkap.
        </p>
      </div>
    );
  }

  // Tampilan Utama Bus Detail
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 overflow-hidden w-full">
      <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Detail Bus</h3>
      
      <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden mb-6 border border-gray-200">
        <img
          src={imgSrc}
          alt={`Bus ${bus.plat_nomor}`}
          className="w-full h-full object-cover"
          onError={(event) => {
            event.currentTarget.src = "/assets/icons/bus.svg";
          }}
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
  );
}