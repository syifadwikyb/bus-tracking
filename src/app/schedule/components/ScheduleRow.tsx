'use client';

import { Eye, Pencil, Trash2 } from 'lucide-react';
import ActionButton from '@/components/ActionButton';

interface Schedule {
  id_schedule: number;
  bus: { plat_nomor: string };
  driver: { nama: string };
  tanggal: string;
  jam_mulai: string;
  jam_selesai: string;
  status: 'dijadwalkan' | 'berjalan' | 'selesai' | string;
}

interface ScheduleRowProps {
  schedule: Schedule;
  onShow: (schedule: Schedule) => void;
  onEdit: (schedule: Schedule) => void;
  onDelete: (schedule: Schedule) => void;
}

function formatDate(dateString: string) {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('id-ID', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

const StatusBadge = ({ status }: { status: Schedule['status'] }) => {
  let color = 'bg-gray-100 text-gray-700';
  let text = 'Tidak diketahui';

  switch (status) {
    case 'dijadwalkan':
      color = 'bg-orange-100 text-orange-700';
      text = 'Dijadwalkan';
      break;
    case 'berjalan':
      color = 'bg-blue-100 text-blue-700';
      text = 'Berjalan';
      break;
    case 'selesai':
      color = 'bg-green-100 text-green-700';
      text = 'Selesai';
      break;
  }

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${color}`}>
      {text}
    </span>
  );
};

export default function ScheduleRow({
  schedule,
  onShow,
  onEdit,
  onDelete,
}: ScheduleRowProps) {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {schedule.bus?.plat_nomor || '-'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
        {schedule.driver?.nama || '-'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
        {formatDate(schedule.tanggal)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
        {schedule.jam_mulai}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
        {schedule.jam_selesai}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge status={schedule.status} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex items-center space-x-2">
          <ActionButton
            color="green"
            icon={<Eye size={16} />}
            onClick={() => onShow(schedule)}
            title="Lihat Jadwal"
          />
          <ActionButton
            color="yellow"
            icon={<Pencil size={16} />}
            onClick={() => onEdit(schedule)}
            title="Edit Jadwal"
          />
          <ActionButton
            color="red"
            icon={<Trash2 size={16} />}
            onClick={() => onDelete(schedule)}
            title="Hapus Jadwal"
          />
        </div>
      </td>
    </tr>
  );
}
