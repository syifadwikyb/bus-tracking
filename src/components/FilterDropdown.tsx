'use client';

import { Filter } from 'lucide-react';
import { useState } from 'react';

// Tipe untuk satu set filter
type FilterSet = {
    label: string;
    options: string[];
    value: string;
    onChange: (value: string) => void;
};

interface FilterDropdownProps {
    filters: FilterSet[];
}

// Tombol filter dan modal/dropdown
export default function FilterDropdown({ filters }: FilterDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            {/* Tombol Filter */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 border border-gray-300 rounded-lg text-gray-700 shadow-sm hover:bg-gray-50 transition-all"
                title="Filter"
            >
                <Filter size={20} />
            </button>

            {/* Dropdown Konten */}
            {isOpen && (
                <div
                    className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl z-50 border border-gray-200"
                    onClick={(e) => e.stopPropagation()} // Mencegah penutupan saat diklik
                >
                    <div className="p-4 border-b">
                        <h3 className="text-lg font-semibold text-gray-900">Filter Options</h3>
                    </div>

                    <form className="p-4 space-y-4">
                        {filters.map((filter) => (
                            <div key={filter.label}>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {filter.label}
                                </label>
                                <select
                                    value={filter.value}
                                    onChange={(e) => filter.onChange(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Semua {filter.label}</option>
                                    {filter.options.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ))}

                        <div className="mt-6 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Terapkan
                            </button>
                        </div>
                    </form>
                </div>
            )}
            {/* Overlay untuk menutup modal saat diklik di luar */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}
        </div>
    );
}
