"use client";

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { API_URL } from '@/lib/config';

interface DriverInfoProps {
  bus: any;
}

export default function DriverInfo({ bus }: DriverInfoProps) {
  // 1. AMBIL NAMA
  // Kita pakai prioritas: Cek 'nama_driver' dulu (standar backend kita),
  // kalau tidak ada baru cek 'nama'.
  const nama = bus?.nama_driver || bus?.nama || '-';

  const penumpang = bus?.penumpang || 0;
  const kapasitas = bus?.kapasitas || 0;

  const [imgSrc, setImgSrc] = useState("/assets/icons/Profile.svg");

  // DriverInfo.tsx
  useEffect(() => {
    const fotoDriver = bus?.foto_driver;

    if (fotoDriver) {
      const url = fotoDriver.startsWith('http')
        ? fotoDriver
        : `${API_URL}/uploads/${fotoDriver}`;

      // 👇 TAMBAHKAN INI UNTUK MENGECEK
      console.log("👉 URL FOTO DRIVER:", url);

      setImgSrc(url);
    } else {
      setImgSrc("/assets/icons/Profile.svg");
    }
  }, [bus]);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-4">

      {/* Container Gambar */}
      <div className="relative w-14 h-14 flex-shrink-0">
        <img
          src={imgSrc}
          alt={`Foto ${nama}`}
          className="w-full h-full rounded-full object-cover border border-gray-200"
          onError={(e) => {
            // Jika error, ganti ke icon default
            e.currentTarget.src = "/assets/icons/Profile.svg";
          }}
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-500">Sopir</p>
        <p className="text-lg font-semibold text-gray-800 truncate" title={nama}>
          {nama}
        </p>
      </div>

      <div className="text-right whitespace-nowrap">
        <p className="text-sm text-gray-500">Penumpang</p>
        <p className="text-lg font-bold text-blue-600">
          {penumpang}<span className="text-gray-400 text-sm font-normal">/{kapasitas}</span>
        </p>
      </div>
    </div>
  );
}