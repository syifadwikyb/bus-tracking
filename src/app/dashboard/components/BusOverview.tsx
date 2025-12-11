// app/bus_stop/dashboard/components/BusOverview.tsx
'use client';

import React from 'react';

export interface BusForOverview {
    id_bus?: number | string;
    kode_bus?: string | null;
    plat_nomor?: string | null;
    jenis_bus?: string | null;
    status?: string | null;
    latitude?: number | string | null;
    longitude?: number | string | null;
    penumpang?: number | null;
    kapasitas?: number | null;
    nama?: string | null;
    nama_jalur?: string | null;
    foto?: string | null;
    driver_foto?: string | null;
}

const empty = {
    id_bus: '-',
    kode_bus: '-',
    plat_nomor: '-',
    jenis_bus: '-',
    status: 'N/A',
    latitude: '-',
    longitude: '-',
    penumpang: '-',
    kapasitas: '-',
    nama: '-',
    nama_jalur: '-',
    foto: null,
    driver_foto: null,
};

export default function BusOverview({ bus }: { bus: BusForOverview | null }) {
    const b = bus ? { ...empty, ...bus } : empty;
    return (
        <div className="bg-white rounded-md shadow-sm p-4">
            <h3 className="text-lg font-semibold mb-3">Bus Overview</h3>

            <div className="flex gap-4">
                <div className="w-28 h-20 bg-gray-100 rounded-md flex items-center justify-center">
                    {b.foto ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={String(b.foto)} alt="bus" className="object-cover w-full h-full rounded" />
                    ) : (
                        <span className="text-sm text-gray-400">No Image</span>
                    )}
                </div>

                <div className="flex-1">
                    <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-600">
                        <div>Nomor Polisi</div><div className="font-medium">{b.plat_nomor ?? 'N/A'}</div>

                        <div>Rute</div><div className="font-medium">{b.nama_jalur ?? 'N/A'}</div>

                        <div>Jenis Bus</div><div className="font-medium">{b.jenis_bus ?? 'N/A'}</div>

                        <div>Supir</div><div className="font-medium">{b.nama ?? 'N/A'}</div>

                        <div>Penumpang</div><div className="font-medium">{b.penumpang ?? 'N/A'} / {b.kapasitas ?? 'N/A'}</div>

                        <div>Status</div><div className="font-medium">{b.status ?? 'N/A'}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
