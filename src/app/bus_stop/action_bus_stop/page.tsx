'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AddBusStop from './AddBusStop';
import EditBusStop from './EditBusStop';
import ShowBusStop from './ShowBusStop';

function ActionBusStopContent() {
    const searchParams = useSearchParams();
    const mode = searchParams.get('mode');
    const id = searchParams.get('id');

    if (mode === 'show' && id) {
        return <ShowBusStop id={id} />;
    }

    if (mode === 'edit' && id) {
        return <EditBusStop id={id} />;
    }

    return <AddBusStop />;
}

export default function ActionBusStopPage() {
    return (
        <Suspense fallback={<div className="p-6 text-center">Memuat halaman...</div>}>
            <ActionBusStopContent />
        </Suspense>
    );
}