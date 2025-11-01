'use client';

import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Tombol "Add New +"
export default function AddButton() {
    const router = useRouter();

    // Arahkan ke halaman 'new' (misal: /bus_stop/bus/new)
    const handleClick = () => {
        // Asumsi halaman tambah ada di '/new'. Sesuaikan jika perlu.
        router.push('bus/new');
    };

    return (
        <button
            onClick={handleClick}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all"
        >
            <Plus size={18} />
            <span className="font-medium">Add New</span>
        </button>
    );
}
