'use client';

import { Eye, Pencil, Trash2 } from 'lucide-react';
// Impor komponen global (pastikan path ini benar)
import ActionButton from '@/components/ActionButton';

// Tipe data Bus (harus sama dengan yang ada di BusTable)
interface Bus {
    id_bus: number;
    kode_bus: string;
    plat_nomor: string;
    kapasitas: number;
    jenis_bus: string;
    status: 'berjalan' | 'dijadwalkan' | 'berhenti' | 'dalam perbaikan';
}

interface BusRowProps {
    bus: Bus;
    onShow: (bus: Bus) => void;
    onEdit: (bus: Bus) => void;
    onDelete: (bus: Bus) => void;
}

// Komponen Badge Status
// BusRow.tsx

const StatusBadge = ({ status }: { status: Bus['status'] }) => {
    // Normalisasi string (jaga-jaga kalau ada huruf besar dari DB lama)
    const normalizedStatus = status ? status.toLowerCase() : '';

    let statusText = '';
    let statusClass = '';

    if (normalizedStatus === 'berjalan') {
        statusText = 'Berjalan'; // Running
        statusClass = 'bg-green-100 text-green-700 border border-green-200';
    } else if (normalizedStatus === 'dijadwalkan') {
        statusText = 'Dijadwalkan'; // Scheduled
        statusClass = 'bg-blue-100 text-blue-700 border border-blue-200';
    } else if (normalizedStatus === 'dalam perbaikan') {
        statusText = 'Perbaikan'; // Maintenance
        statusClass = 'bg-yellow-100 text-yellow-800 border border-yellow-200';
    } else {
        // Default ke Berhenti untuk semua status lain
        statusText = 'Berhenti'; // Stopped
        statusClass = 'bg-red-100 text-red-600 border border-red-200';
    }

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusClass}`}>
            {statusText}
        </span>
    );
};

// Komponen Baris Tabel
export default function BusRow({ bus, onShow, onEdit, onDelete }: BusRowProps) {
    return (
        <tr className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {bus.plat_nomor}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {bus.jenis_bus}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {bus.kapasitas}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={bus.status} />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {/* Tombol Aksi */}
                <div className="flex items-center space-x-2 justify-center">
                    <ActionButton
                        color="green"
                        icon={<Eye size={16} />}
                        onClick={() => onShow(bus)}
                        title="View Details"
                    />
                    <ActionButton
                        color="yellow"
                        icon={<Pencil size={16} />}
                        onClick={() => onEdit(bus)}
                        title="Edit Bus"
                    />
                    <ActionButton
                        color="red"
                        icon={<Trash2 size={16} />}
                        onClick={() => onDelete(bus)}
                        title="Delete Bus"
                    />
                </div>
            </td>
        </tr>
    );
}

