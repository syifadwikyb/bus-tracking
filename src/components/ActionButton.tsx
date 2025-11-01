'use client';

// Komponen tombol aksi (View, Edit, Delete)
interface ActionButtonProps {
    color: 'green' | 'yellow' | 'red';
    icon: React.ReactNode;
    onClick: () => void;
    title?: string; // Teks untuk 'tooltip' saat di-hover
}

export default function ActionButton({ color, icon, onClick, title }: ActionButtonProps) {
    const colorClasses = {
        green: 'bg-green-100 text-green-600 hover:bg-green-200',
        yellow: 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200',
        red: 'bg-red-100 text-red-600 hover:bg-red-200',
    };

    return (
        <button
            onClick={onClick}
            title={title}
            className={`p-2 rounded-lg transition-colors ${colorClasses[color]}`}
        >
            {icon}
        </button>
    );
}
