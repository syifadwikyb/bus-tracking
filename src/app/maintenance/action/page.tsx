'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

import AddMaintenance from './AddMaintenance';
import EditMaintenance from './EditMaintenance';
import ShowMaintenance from './ShowMaintenance';

function MaintenanceActionPage() {
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');
  const id = searchParams.get('id');

  if (mode === 'edit' && id) {
    return <EditMaintenance id={id} />;
  }

  if (mode === 'show' && id) {
    return <ShowMaintenance id={id} />;
  }

  return <AddMaintenance />;
}

export default function Page() {
  return (
    <div className="p-8">
      <Suspense fallback={<div className="p-6 text-center">Memuat...</div>}>
        <MaintenanceActionPage />
      </Suspense>
    </div>
  );
}