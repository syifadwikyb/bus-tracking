"use client";

interface DriverInfoProps {
  bus: any;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function DriverInfo({ bus }: DriverInfoProps) {
  const nama = bus?.nama_driver ||
    bus?.nama ||
    bus?.jadwal?.[0]?.driver?.nama ||
    '-';
  const penumpang = bus?.penumpang || 0;
  const kapasitas = bus?.kapasitas || 0;

  const fotoFileName = bus?.driver_foto;

  const urlFoto = fotoFileName
    ? `${API_URL}/uploads/${fotoFileName}`
    : "/assets/icons/Profile.svg";

  console.log("Driver dari jadwal:", bus?.jadwal?.[0]?.driver);
  console.log(bus);
  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-4">      
      <div className="relative w-14 h-14 flex-shrink-0">
        <img
          src={urlFoto}
          alt={`Foto ${nama}`}
          className="w-full h-full rounded-full object-cover border border-gray-200"
          onError={(e) => {
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