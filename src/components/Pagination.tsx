'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageSelect: (page: number) => void;
  onPrev: () => void;
  onNext: () => void;
}

// Komponen paginasi
export default function Pagination({
  currentPage,
  totalPages,
  onPageSelect,
  onPrev,
  onNext,
}: PaginationProps) {
  
  // Membuat array nomor halaman, misal: [1, 2, 3]
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="flex items-center justify-end gap-2">
      {/* Tombol Previous */}
      <button
        onClick={onPrev}
        disabled={currentPage === 1}
        className="flex items-center justify-center p-2 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50"
        title="Previous"
      >
        <ChevronLeft size={18} />
      </button>

      {/* Nomor Halaman */}
      <div className="flex items-center gap-1">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageSelect(page)}
            className={`px-3 py-1 rounded-lg text-sm font-medium ${
              currentPage === page
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Tombol Next */}
      <button
        onClick={onNext}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center p-2 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50"
        title="Next"
      >
        <ChevronRight size={18} />
      </button>
    </nav>
  );
}
