'use client';

import { Eye, Pencil, Trash2 } from 'lucide-react';
import ActionButton from '@/components/ActionButton';

// Tipe data Driver
interface Driver {
    id_driver: number;
    kode_driver: string;
    nama: string;
    tanggal_lahir: string;
    nomor_telepon: string;
    status: 'berjalan' | 'berhenti' | 'dijadwalkan' | string;
}

interface DriverRowProps {
    driver: Driver;
    onShow: (driver: Driver) => void;
    onEdit: (driver: Driver) => void;
    onDelete: (driver: Driver) => void;
}

// Fungsi helper untuk memformat tanggal
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

// Komponen Badge Status
const StatusBadge = ({ status }: { status: Driver['status'] }) => {
    let statusText: string;
    let statusClass: string;

    // Default-kan status null/undefined ke 'berhenti'
    const normalizedStatus = (status || 'berhenti').toLowerCase();

    switch (normalizedStatus) {
        case 'berjalan':
            statusText = 'Berjalan';
            statusClass = 'bg-green-100 text-green-700';
            break;
        case 'dijadwalkan':
            statusText = 'Dijadwalkan';
            statusClass = 'bg-blue-100 text-blue-700';
            break;
        case 'berhenti':
            statusText = 'Berhenti';
            statusClass = 'bg-orange-100 text-orange-700';
            break;
        default:
            statusText = 'Unknown';
            statusClass = 'bg-gray-100 text-gray-700';
    }

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusClass}`}>
            {statusText}
        </span>
    );
};

// Komponen utama baris tabel
export default function DriverRow({ driver, onShow, onEdit, onDelete }: DriverRowProps) {
    return (
        <tr className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {driver.nama}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {formatDate(driver.tanggal_lahir)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {driver.nomor_telepon}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={driver.status} />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center space-x-2">
                    <ActionButton
                        color="green"
                        icon={<Eye size={16} />}
                        onClick={() => onShow(driver)}
                        title="View Details"
                    />
                    <ActionButton
                        color="yellow"
                        icon={<Pencil size={16} />}
                        onClick={() => onEdit(driver)}
                        title="Edit Driver"
                    />
                    <ActionButton
                        color="red"
                        icon={<Trash2 size={16} />}
                        onClick={() => onDelete(driver)}
                        title="Delete Driver"
                    />
                </div>
            </td>
        </tr>
    );
}