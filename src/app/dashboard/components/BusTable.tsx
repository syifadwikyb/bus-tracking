"use client";
import { type Bus } from "../DashboardClient";

type BusTableProps = {
  buses: Bus[];
  onRowClick: (bus: Bus) => void;
};

export default function BusTable({ buses, onRowClick }: BusTableProps) {
  const getStatusClass = (status: string) => {
    switch (status?.toLowerCase()) {
      case "berjalan":
        return "text-green-600 bg-green-100";
      case "berhenti":
        return "text-orange-600 bg-orange-100";
      case "dalam perbaikan":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-500 bg-gray-100";
    }
  };

  const runningBuses = buses.filter(
    (bus) => bus.status?.toLowerCase() === "berjalan"
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Bus Number
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Rute
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Driver
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Kapasitas
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Status
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {runningBuses.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                Tidak ada bus berjalan
              </td>
            </tr>
          ) : (
            runningBuses.map((bus) => (
              <tr
                key={bus.id_bus}
                onClick={() => onRowClick(bus)} // ✅ KIRIM BUS
                className="hover:bg-gray-50 cursor-pointer"
              >
                <td className="px-6 py-4 font-medium">{bus.plat_nomor}</td>
                <td className="px-6 py-4">{bus.nama_jalur ?? "N/A"}</td>
                <td className="px-6 py-4">{bus.nama ?? "N/A"}</td>
                <td className="px-6 py-4">
                  {bus.penumpang} / {bus.kapasitas}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${getStatusClass(
                      bus.status
                    )}`}
                  >
                    {bus.status}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
