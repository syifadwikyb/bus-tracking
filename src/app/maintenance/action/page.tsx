'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

// 1. Impor SEMUA komponen form Anda
import AddMaintenance from './AddMaintenance';
import EditMaintenance from './EditMaintenance';
import ShowMaintenance from './ShowMaintenance';

// 2. Komponen ini membaca URL
function MaintenanceActionPage() {
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');
  const id = searchParams.get('id');

  // 3. Logika untuk memutuskan
  // Jika mode=edit DAN ada id, tampilkan EditMaintenance
  if (mode === 'edit' && id) {
    return <EditMaintenance id={id} />;
  }

  // Jika mode=show DAN ada id, tampilkan ShowMaintenance
  if (mode === 'show' && id) {
    return <ShowMaintenance id={id} />;
  }

  // Jika tidak, tampilkan AddMaintenance (default)
  return <AddMaintenance />;
}

// 4. Bungkus dengan Suspense (wajib untuk useSearchParams)
export default function Page() {
  return (
    <div className="p-8">
      <Suspense fallback={<div className="p-6 text-center">Memuat...</div>}>
        <MaintenanceActionPage />
      </Suspense>
    </div>
  );
}