'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AddBus from './AddBus';
import EditBus from './EditBus';
import ShowBus from './ShowBus';

function ActionBusContent() {
    const searchParams = useSearchParams();
    const mode = searchParams.get('mode');
    const id = searchParams.get('id');

    if (mode === 'show' && id) {
        return <ShowBus id={id} />;
    }

    if (mode === 'edit' && id) {
        return <EditBus id={id} />;
    }

    return <AddBus />;
}

export default function ActionBusPage() {
    return (
        <Suspense fallback={<div className="p-6 text-center">Memuat halaman...</div>}>
            <ActionBusContent />
        </Suspense>
    );
}