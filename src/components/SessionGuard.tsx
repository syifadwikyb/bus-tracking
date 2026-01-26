'use client';

import { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const TIMEOUT_MS = 15 * 60 * 1000; // 5 menit

export default function SessionGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Jangan aktif di halaman login
    if (pathname === '/login') return;

    const doLogout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      document.cookie =
        'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';

      alert('Sesi Anda berakhir karena tidak aktif selama 5 menit.');
      router.replace('/login');
    };

    const resetTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(doLogout, TIMEOUT_MS);
    };

    // 🔥 Deteksi aktivitas user
    const activityEvents = ['mousemove', 'keydown', 'click', 'scroll'];

    activityEvents.forEach((event) =>
      window.addEventListener(event, resetTimer)
    );

    // 🔥 Deteksi tab tidak aktif
    const handleVisibilityChange = () => {
      if (document.hidden) {
        timerRef.current = setTimeout(doLogout, TIMEOUT_MS);
      } else {
        resetTimer();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Start timer pertama
    resetTimer();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);

      activityEvents.forEach((event) =>
        window.removeEventListener(event, resetTimer)
      );

      document.removeEventListener(
        'visibilitychange',
        handleVisibilityChange
      );
    };
  }, [router, pathname]);

  return <>{children}</>;
}
