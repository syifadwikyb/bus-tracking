"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar"; 

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // ⚠️ [MODE TESTING PERFORMA - BYPASS AKTIF]
    // Kita matikan pengecekan token di sini agar bisa masuk tanpa login

    /* --- KODE ASLI (DI-KOMENTAR) ---
    const token = localStorage.getItem("token");
    const isAuthPage = pathname.startsWith("/auth");

    if (!token && !isAuthPage) {
      router.push("/auth/login");
    } else if (token && isAuthPage) {
      router.push("/dashboard");
    } else {
      setIsLoading(false);
    }
    ---------------------------------- */

    // GANTI JADI INI:
    // Langsung set loading selesai agar konten muncul
    setIsLoading(false); 

  }, [pathname, router]);

  // Tutup sidebar otomatis saat pindah halaman (UX Mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  if (isLoading) {
    return <div className="h-screen w-full bg-white"></div>;
  }

  const isAuthPage = pathname.startsWith("/auth");
  if (isAuthPage) {
    return <div className="h-screen w-full bg-gray-100">{children}</div>;
  }

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 md:p-8">          
            <button
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden fixed top-4 left-4 z-30 p-2 bg-blue-600 text-white rounded-lg shadow-lg"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            </button>

            {children}
        </div>
      </main>
    </div>
  );
}