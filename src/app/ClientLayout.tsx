"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar"; // Pastikan path benar

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  
  // 1. State untuk Loading Auth
  const [isLoading, setIsLoading] = useState(true);
  
  // 2. State untuk Buka/Tutup Sidebar di Mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const isAuthPage = pathname.startsWith("/auth");

    if (!token && !isAuthPage) {
      router.push("/auth/login");
    } else if (token && isAuthPage) {
      router.push("/dashboard");
    } else {
      setIsLoading(false);
    }
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
      
      {/* ✅ SIDEBAR 
        Kita oper props:
        - isOpen: status dari state
        - onClose: fungsi untuk mengubah state jadi false
      */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      {/* KONTEN UTAMA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
            
            {/* ✅ HEADER
              Jika Header ada di sini (Global), pasang props onMenuClick.
              Jika Header Anda ada di dalam masing-masing page.tsx (Dashboard, Bus, dll),
              Anda perlu cara lain (seperti Zustand) atau oper setter ke children.
              
              UNTUK KEMUDAHAN SEKARANG:
              Saya asumsikan Header ada di dalam masing-masing Page.
              Agar tombol hamburger di Header berfungsi, kita perlu trick sedikit 
              atau memindahkan Header ke Layout ini.
            */}
            
            {/* OPSI TERBAIK: Pindahkan <Header /> ke sini (Layout) agar muncul di semua halaman 
               dan gampang connect ke Sidebar.
            */}
            
            {/* <Header 
                  title="Judul Halaman" 
                  subtitle="Subjudul" 
                  onMenuClick={() => setIsSidebarOpen(true)} 
                /> 
            */}

            {/* Render Halaman (Dashboard, Bus, dll) */}
            {/* KITA PERLU MENGIRIM FUNGSI BUKA SIDEBAR KE BAWAH
               Cara termudah tanpa library tambahan adalah mempassing props ke children 
               (tapi di Next.js children itu opaque).
               
               JADI: Kita buat tombol hamburger "Global" di pojok kiri atas (khusus mobile)
               jika Header Anda tersebar di banyak file.
            */}
            
            {/* Tombol Hamburger Cadangan (Floating Button Mobile Only) */}
            {/* Muncul hanya jika belum ada Header global */}
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