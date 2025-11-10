'use client';

import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AddButton {
  route: string; // route tujuan
}

export default function AddButton({ route }: AddButton) {
  const router = useRouter();

  const handleClick = () => {
    router.push(route); // redirect ke halaman yang ditentukan
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
