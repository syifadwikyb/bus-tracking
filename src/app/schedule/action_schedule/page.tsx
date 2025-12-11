'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AddSchedule from './AddSchedule';
import EditSchedule from './EditSchedule';
import ShowSchedule from './ShowSchedule';

function ScheduleActionPage() {
    const searchParams = useSearchParams();
    const mode = searchParams.get('mode');
    const id = searchParams.get('id');

    if (mode === 'edit' && id) {
        return <EditSchedule id={id} />;
    }
    if (mode === 'show' && id) {
        return <ShowSchedule id={id} />;
    }
    return <AddSchedule />;
}

export default function Page() {
    return (
        <div className="p-8">
            <Suspense fallback={<div className="p-6 text-center">Memuat...</div>}>
                <ScheduleActionPage />
            </Suspense>
        </div>
    );
}