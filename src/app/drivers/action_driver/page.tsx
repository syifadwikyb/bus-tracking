'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AddDriver from './AddDriver';
import EditDriver from './EditDriver';
import ShowDriver from './ShowDriver';

function ActionDriverContent() {
    const searchParams = useSearchParams();
    const mode = searchParams.get('mode');
    const id = searchParams.get('id');

    if (mode === 'show' && id) {
        return <ShowDriver id={id} />;
    }

    if (mode === 'edit' && id) {
        return <EditDriver id={id} />;
    }

    return <AddDriver />;
}

export default function ActionDriverPage() {
    return (
        <Suspense fallback={<div className="p-6 text-center">Memuat halaman...</div>}>
            <ActionDriverContent />
        </Suspense>
    );
}