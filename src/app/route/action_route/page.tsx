'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AddRoute from './AddRoute';
import EditRoute from './EditRoute';
import ShowRoute from './ShowRoute';

function ActionRouteContent() {
    const searchParams = useSearchParams();
    const mode = searchParams.get('mode');
    const id = searchParams.get('id');

    if (mode === 'show' && id) {
        return <ShowRoute id={id} />;
    }

    if (mode === 'edit' && id) {
        return <EditRoute id={id} />;
    }

    return <AddRoute />;
}

export default function ActionRoutePage() {
    return (
        <Suspense fallback={<div className="p-6 text-center">Memuat halaman...</div>}>
            <ActionRouteContent />
        </Suspense>
    );
}