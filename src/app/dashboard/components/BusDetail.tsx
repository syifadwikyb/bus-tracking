import React from 'react';

interface BusDetails {
  imageUrl: string;
  plateNumber: string;
  type: string;
  status: 'On Time' | 'Delayed' | 'Maintenance';
}

const selectedBus: BusDetails = {
  imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1887&auto=format&fit=crop',
  plateNumber: 'H 1234 XYZ',
  type: 'Big Bus - Mercedes Benz',
  status: 'On Time',
};

const getStatusStyles = (status: BusDetails['status']) => {
  switch (status) {
    case 'On Time':
      return 'bg-green-100 text-green-800';
    case 'Delayed':
      return 'bg-yellow-100 text-yellow-800';
    case 'Maintenance':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function BusDetail() {
  if (!selectedBus) {
    return (
      <div className="bg-white rounded-3xl shadow-lg p-6 h-full flex items-center justify-center">
        <p className="text-gray-500 text-center">Pilih bus di peta untuk melihat detailnya.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 flex flex-col gap-4">
      {/* Judul Komponen */}
      <h3 className="font-bold text-gray-800 text-lg">Bus Overview</h3>
      
      {/* Gambar Bus */}
      <div className="aspect-video w-full overflow-hidden rounded-xl">
        <img 
          src={selectedBus.imageUrl} 
          alt={`Foto bus ${selectedBus.plateNumber}`}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Detail Bus */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500">Nomor Polisi</p>
            <h4 className="font-bold text-xl text-gray-900 tracking-wider">{selectedBus.plateNumber}</h4>
          </div>
          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusStyles(selectedBus.status)}`}>
            {selectedBus.status}
          </span>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">Jenis Armada</p>
          <p className="font-semibold text-gray-800">{selectedBus.type}</p>
        </div>
      </div>
    </div>
  );
}