'use client';

import { Eye, Pencil, Trash2 } from 'lucide-react';
import ActionButton from '@/components/ActionButton';

export interface Route {
    id_jalur: number;
    kode_jalur: string;
    nama_jalur: string;
    rute_polyline?: string;
    status: string;
}

interface RouteRowProps {
    route: Route;
    onShow: (route: Route) => void;
    onEdit: (route: Route) => void;
    onDelete: (route: Route) => void;
}

function formatPolyline(poly: string | null | undefined): string {
    if (!poly || poly.trim() === '') return 'N/A';
    const maxLength = 20;
    if (poly.length > maxLength) {
        return `${poly.substring(0, maxLength)}...`;
    }
    return poly;
}

const StatusBadge = ({ status }: { status: string | null | undefined }) => {
    const normalizedStatus = status ? status.toLowerCase().trim() : '';

    let statusText = status || 'N/A';
    let statusClass = 'bg-gray-100 text-gray-700';

    if (normalizedStatus === 'aktif' || normalizedStatus === 'berjalan') {
        statusText = 'Aktif';
        statusClass = 'bg-green-100 text-green-700';
    } else if (normalizedStatus === 'tidak aktif' || normalizedStatus === 'berhenti') {
        statusText = 'Tidak Aktif';
        statusClass = 'bg-red-100 text-red-700';
    }

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusClass}`}>
            {statusText}
        </span>
    );
};

export default function RouteRow({ route, onShow, onEdit, onDelete }: RouteRowProps) {
    const polylineData = route.rute_polyline;

    return (
        <tr className="hover:bg-gray-50 transition-colors border-b border-gray-100">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {route.kode_jalur}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {route.nama_jalur}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={route.status} />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                {formatPolyline(polylineData)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex justify-center items-center space-x-2">
                    <ActionButton
                        color="green"
                        icon={<Eye size={16} />}
                        onClick={() => onShow(route)}
                        title="Lihat Detail"
                    />
                    <ActionButton
                        color="yellow"
                        icon={<Pencil size={16} />}
                        onClick={() => onEdit(route)}
                        title="Edit Rute"
                    />
                    <ActionButton
                        color="red"
                        icon={<Trash2 size={16} />}
                        onClick={() => onDelete(route)}
                        title="Hapus Rute"
                    />
                </div>
            </td>
        </tr>
    );
}