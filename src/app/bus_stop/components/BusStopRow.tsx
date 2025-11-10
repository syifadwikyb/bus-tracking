'use client';

import { Eye, Pencil, Trash2 } from 'lucide-react';
import ActionButton from '@/components/ActionButton';

interface BusStop {
    id_halte: number;
    nama_halte: string;
    latitude: string;
    longitude: string;
    jalur?: { nama_jalur: string };
}

interface BusStopRowProps {
    halte: BusStop;
    onShow: (halte: BusStop) => void;
    onEdit: (halte: BusStop) => void;
    onDelete: (halte: BusStop) => void;
}

export default function BusStopRow({ halte, onShow, onEdit, onDelete }: BusStopRowProps) {
    return (
        <tr className="hover:bg-gray-50 transition">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {halte.nama_halte}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {halte.latitude}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {halte.longitude}
            </td>
            <td className="px-6 py-4 text-sm text-gray-700">
                {halte.jalur?.nama_jalur || '—'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center space-x-2">
                    <ActionButton
                        color="green"
                        icon={<Eye size={16} />}
                        onClick={() => onShow(halte)}
                        title="View Details"
                    />
                    <ActionButton
                        color="yellow"
                        icon={<Pencil size={16} />}
                        onClick={() => onEdit(halte)}
                        title="Edit Driver"
                    />
                    <ActionButton
                        color="red"
                        icon={<Trash2 size={16} />}
                        onClick={() => onDelete(halte)}
                        title="Delete Driver"
                    />
                </div>
            </td>
        </tr>
    );
}
