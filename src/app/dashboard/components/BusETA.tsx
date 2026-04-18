"use client";

import { type Bus } from "../DashboardClient";

type BusETAProps = {
  bus: Bus | null;
};

export default function BusETA({ bus }: BusETAProps) {
    if (!bus || bus.id_bus === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center min-h-[300px]">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">🚌</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-800">Prediksi Kedatangan Bus</h3>
        <p className="text-sm text-gray-500 mt-2">
          Pilih bus dari peta<br />untuk melihat prediksi kedatangan bus.
        </p>
      </div>
    );
  }

  const formatDistance = (meters: number) => {
    if (meters < 1000) return `${meters} m`;
    return `${(meters / 1000).toFixed(1)} km`;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 overflow-hidden w-full">
      <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Prediksi Kedatangan</h3>
      
      <div className="max-h-[400px] overflow-y-auto pr-2">
        {!bus.daftar_eta || bus.daftar_eta.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center text-gray-500">
            <span className="text-4xl mb-4 opacity-50">⏳</span>
            <p className="text-sm">Prediksi rute belum tersedia atau<br />bus sedang tidak beroperasi.</p>
          </div>
        ) : (
          <div className="relative border-l-2 border-blue-200 ml-4 mt-2">
            {bus.daftar_eta.map((eta: any, index: number) => {
              const isTarget = eta.is_target; 
              const etaMinutes = eta.eta_seconds ? Math.round(eta.eta_seconds / 60) : 0;

              return (
                <div key={eta.halte_id || index} className="mb-6 ml-6 relative">                  
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
  );
}