'use client';

import { Eye, Pencil, Trash2 } from 'lucide-react';
// Impor komponen global (pastikan path ini benar)
// Path ini relatif dari 'bus_stop/route/components' ke 'components'
import ActionButton from '@/components/ActionButton';

// Tipe data Rute (harus sama dengan 'RouteTable')
interface Route {
    id_jalur: number;
    kode_jalur: string;
    nama_jalur: string;
    rute_polyline: string;
    status: 'aktif' | 'tidak aktif';
}

interface RouteRowProps {
    route: Route;
    onShow: (route: Route) => void;
    onEdit: (route: Route) => void;
    onDelete: (route: Route) => void;
}

/**
 * Fungsi helper untuk memotong string polyline sesuai permintaan (12 angka)
 * @param poly - String polyline yang panjang
 * @returns String yang sudah dipotong
 */
function formatPolyline(poly: string | null | undefined): string {
    if (!poly) return 'N/A';

    const maxLength = 12;

    if (poly.length > maxLength) {
        return `${poly.substring(0, maxLength)}...`;
    }
    return poly;
}

// Komponen Badge Status (sesuai desain "Active")
const StatusBadge = ({ status }: { status: Route['status'] }) => {
    let statusText: string;
    let statusClass: string;

    switch (status) {
        case 'aktif':
            statusText = 'Active'; // Sesuai desain 'Active'
            statusClass = 'bg-green-100 text-green-700';
            break;
        case 'tidak aktif':
            statusText = 'Inactive';
            statusClass = 'bg-red-100 text-red-700'; // Merah untuk Inactive
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
export default function RouteRow({ route, onShow, onEdit, onDelete }: RouteRowProps) {
    return (
        <tr className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {route.kode_jalur}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {route.nama_jalur}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={route.status} />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">
                {/* Menggunakan fungsi formatPolyline di sini */}
                {formatPolyline(route.rute_polyline)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {/* Tombol Aksi */}
                <div className="flex items-center space-x-2">
                    <ActionButton
                        color="green"
                        icon={<Eye size={16} />}
                        onClick={() => onShow(route)}
                        title="View Details"
                    />
                    <ActionButton
                        color="yellow"
                        icon={<Pencil size={16} />}
                        onClick={() => onEdit(route)}
                        title="Edit Route"
                    />
                    <ActionButton
                        color="red"
                        icon={<Trash2 size={16} />}
                        onClick={() => onDelete(route)}
                        title="Delete Route"
                    />
                </div>
            </td>
        </tr>
    );
}
