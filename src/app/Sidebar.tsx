// File: src/app/components/Sidebar.tsx
"use client"; // Diperlukan untuk mendeteksi halaman aktif

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Bus,
    MapPin,
    CalendarDays,
    Map,
    Users,
    Wrench,
    LogOut,
} from "lucide-react";

type NavLinkProps = {
    href: string;
    icon: React.ElementType;
    children: React.ReactNode;
};

// Komponen NavLink (di dalam Sidebar)
const NavLink = ({ href, icon: Icon, children }: NavLinkProps) => {
    const pathname = usePathname(); // Hook untuk mendapatkan URL
    const isActive = pathname.startsWith(href); // Logika 'active' yang dinamis

    return (
        <Link
            href={href}
            className={`flex items-center space-x-3 rounded-lg px-4 py-3 transition-all duration-150 ${
                isActive
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-100"
            }`}
        >
            <Icon className="h-5 w-5" />
            <span className="font-medium">{children}</span>
        </Link>
    );
};

// Ini adalah komponen Sidebar yang sebenarnya
export default function Sidebar() {
    return (
        <aside className="flex w-64 flex-col justify-between bg-white p-4 shadow-lg flex-shrink-0">
            <div>
                <div className="mb-6 flex items-center space-x-2 px-4 py-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white"></span>
                    <span className="text-2xl font-bold text-blue-600">DipTrack</span>
                </div>

                <nav className="flex flex-col space-y-2">
                    <NavLink href="/dashboard" icon={LayoutDashboard}>Dashboard</NavLink>
                    <NavLink href="/bus" icon={Bus}>Bus</NavLink>
                    <NavLink href="/bus-stop" icon={MapPin}>Bus Stop</NavLink>
                    <NavLink href="/schedule" icon={CalendarDays}>Schedule</NavLink>
                    <NavLink href="/route" icon={Map}>Route</NavLink>
                    <NavLink href="/drivers" icon={Users}>Drivers</NavLink>
                    <NavLink href="/maintenance" icon={Wrench}>Maintenance</NavLink>
                </nav>
            </div>

            {/* Tombol Logout */}
            <button className="flex w-full items-center justify-center space-x-3 rounded-lg bg-red-600 px-4 py-3 font-medium text-white shadow-lg transition-all hover:bg-red-700">
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
            </button>
        </aside>
    );
}