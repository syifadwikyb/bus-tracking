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
const StatusBadge = ({ status }: { status: Bus['status'] }) => {
    let statusText: string;
    let statusClass: string;

    switch (status) {
        case 'berjalan':
            statusText = 'Berjalan';
            // Sesuai desain 'Active' (Hijau)
            statusClass = 'bg-green-100 text-green-700';
            break;
        case 'dijadwalkan':
            statusText = 'Dijadwalkan';
            // Sesuai desain 'Active' (Hijau)
            statusClass = 'bg-blue-100 text-blue-700';
            break;
        case 'berhenti':
            statusText = 'Berhenti';
            // Oranye untuk 'Berhenti'
            statusClass = 'bg-orange-100 text-orange-700';
            break;
        case 'dalam perbaikan':
            statusText = 'Perbaikan';
            // Abu-abu untuk status netral
            statusClass = 'bg-gray-200 text-gray-800';
            break;
        default:
            statusText = 'Unknown';
            statusClass = 'bg-gray-100 text-gray-700';
    }

    return (
        <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${statusClass}`}
        >
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
                <div className="flex items-center space-x-2">
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

