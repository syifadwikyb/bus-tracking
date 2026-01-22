import Image from "next/image";
import Link from "next/link";

interface HeaderProps {
    subtitle: string;
    title: string;
}

export default function Header({ subtitle, title }: HeaderProps) {
    return (
        <header className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-blue-800 p-8 shadow-xl mb-8">

            {/* --- 1. DEKORASI BACKGROUND (Pola Abstrak) --- */}
            <div className="absolute inset-0 opacity-10">
                <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
                    <circle cx="80" cy="20" r="20" fill="white" fillOpacity="0.5" />
                    <path d="M 10 10 Q 50 50 90 10" stroke="white" strokeWidth="1" fill="none" />
                </svg>
            </div>

            {/* --- 2. KONTEN UTAMA (Relative z-10 agar di atas background) --- */}
            <div className="relative z-10 flex items-center justify-between">

                {/* Teks Judul */}
                <div>
                    <h3 className="text-sm font-medium text-blue-100 uppercase tracking-wider mb-1">
                        {subtitle}
                    </h3>
                    <h2 className="text-3xl font-bold text-white tracking-tight">
                        {title}
                    </h2>
                </div>

                {/* Tombol Profile dengan Efek Glassmorphism */}
                <Link href="/profile">
                    <div className="group flex h-14 w-14 items-center justify-center rounded-full bg-white/10 border border-white/20 backdrop-blur-md shadow-inner cursor-pointer transition-all duration-300 hover:bg-white/20 hover:scale-105 hover:shadow-lg hover:shadow-blue-900/20">
                        <Image
                            src="/assets/icons/Profile.svg"
                            alt="Admin Profile"
                            width={45}
                            height={45}
                            className="rounded-full object-cover p-0.5 group-hover:opacity-90 transition-opacity"
                        />
                    </div>
                </Link>
            </div>
        </header>
    );
}