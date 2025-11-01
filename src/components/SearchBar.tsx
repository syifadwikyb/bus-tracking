'use client';

import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

// Search bar
export default function SearchBar({ value, onChange, onClear, onSubmit }: SearchBarProps) {
  return (
    <form onSubmit={onSubmit} className="flex-1 min-w-0">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search..."
          className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {/* Ikon Search (di dalam) */}
        <button
          type="submit"
          className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 hover:text-blue-600"
          title="Cari"
        >
          <Search size={20} />
        </button>
        {/* Tombol Clear (X), hanya muncul jika ada teks */}
        {value && (
          <button
            type="button"
            onClick={onClear}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-red-600"
            title="Batal"
          >
            <X size={20} />
          </button>
        )}
      </div>
    </form>
  );
}
