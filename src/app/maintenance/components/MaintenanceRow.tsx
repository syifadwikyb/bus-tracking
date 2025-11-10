'use client';

import { Eye, Pencil, Trash2 } from 'lucide-react';
import ActionButton from '@/components/ActionButton';

// Tipe data Maintenance
interface Maintenance {
    id_maintenance: number;
    bus_id: number;
    tanggal_perbaikan: string;
    tanggal_selesai?: string | null; // ✅ tambahkan ini
    deskripsi: string;
    status: 'sedang diperbaiki' | 'dijadwalkan' | 'selesai' | string;
    harga: number;
    bus?: {
        plat_nomor: string;
        status: string;
    };
}

interface MaintenanceRowProps {
    maintenance: Maintenance;
    onShow: (maintenance: Maintenance) => void;
    onEdit: (maintenance: Maintenance) => void;
    onDelete: (maintenance: Maintenance) => void;
}

// Format tanggal Indonesia
function formatDate(dateString: string) {
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;

        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    } catch {
        return dateString;
    }
}

// Badge Status Maintenance
const StatusBadge = ({ status }: { status: Maintenance['status'] }) => {
    let statusText: string;
    let statusClass: string;

    const normalized = (status || '')
        .toString()
        .trim()
        .toLowerCase()
        .replace(/_/g, ' '); // ganti underscore jadi spasi

    switch (normalized) {
        case 'sedang diperbaiki':
            statusText = 'Sedang Diperbaiki';
            statusClass = 'bg-yellow-100 text-yellow-700';
            break;
        case 'dijadwalkan':
            statusText = 'Dijadwalkan';
            statusClass = 'bg-blue-100 text-blue-700';
            break;
        case 'selesai':
            statusText = 'Selesai';
            statusClass = 'bg-green-100 text-green-700';
            break;
        default:
            statusText = status ? status : 'Unknown';
            statusClass = 'bg-gray-100 text-gray-700';
    }

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusClass}`}>
            {statusText}
        </span>
    );
};


// Baris Tabel Maintenance
export default function MaintenanceRow({
    maintenance,
    onShow,
    onEdit,
    onDelete,
}: MaintenanceRowProps) {
    return (
        <tr className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {maintenance.bus?.plat_nomor || `Bus #${maintenance.bus_id}`}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {formatDate(maintenance.tanggal_perbaikan)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {/* ✅ tampilkan tanggal selesai jika ada */}
                {maintenance.tanggal_selesai ? formatDate(maintenance.tanggal_selesai) : '-'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 max-w-[250px] truncate">
                {maintenance.deskripsi || '-'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                Rp {maintenance.harga?.toLocaleString('id-ID')}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={maintenance.status} />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center space-x-2">
                    <ActionButton
                        color="green"
                        icon={<Eye size={16} />}
                        onClick={() => onShow(maintenance)}
                        title="Lihat Detail"
                    />
                    <ActionButton
                        color="yellow"
                        icon={<Pencil size={16} />}
                        onClick={() => onEdit(maintenance)}
                        title="Edit Data"
                    />
                    <ActionButton
                        color="red"
                        icon={<Trash2 size={16} />}
                        onClick={() => onDelete(maintenance)}
                        title="Hapus Data"
                    />
                </div>
            </td>
        </tr>

    );
}
