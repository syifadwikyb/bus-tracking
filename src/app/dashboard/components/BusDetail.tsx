"use client";
import Image from "next/image";
import { type Bus } from "../DashboardClient";

type BusDetailProps = {
  bus: Bus | null;
};

const DetailRow = ({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) => (
  <div className="flex justify-between py-2 border-b border-gray-100">
    <span className="text-gray-500">{label}</span>
    <span className="font-semibold text-gray-800">{value || "N/A"}</span>
  </div>
);

export default function BusDetail({ bus }: BusDetailProps) {
  if (!bus) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Bus Overview</h3>
        <p className="text-center text-gray-500">
          Pilih bus dari peta atau tabel untuk melihat detail.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4">Bus Overview</h3>

      {/* Gambar Bus */}
      <div className="flex items-center justify-center bg-gray-50 p-4 rounded-lg mb-4">
        {bus.foto ? (
          <Image
            src={
              bus.foto.startsWith("http")
                ? bus.foto
                : `http://localhost:5000/${bus.foto}`
            }
            alt="Bus Image"
            width={160}
            height={300}
            className="rounded-md object-cover w-40 h-40"
          />
        ) : (
          <div className="w-40 h-24 bg-gray-200 rounded-md flex items-center justify-center text-gray-400 text-sm">
            No Image
          </div>
        )}
      </div>

      {/* Detail Bus */}
      <div className="space-y-2">
        <DetailRow label="Nomor Polisi" value={bus.plat_nomor} />
        <DetailRow label="Rute" value={bus.nama_jalur} />
        <DetailRow label="Jenis Bus" value={bus.jenis_bus} />
      </div>
    </div>
  );
}
