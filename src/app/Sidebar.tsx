
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    Bus,
    MapPin,
    CalendarDays,
    Map,
    Users,
    Wrench,
    LogOut,
    BarChart,
    X
} from "lucide-react";
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

type SidebarProps = {
    isOpen: boolean;
    onClose: () => void;
};

type NavLinkProps = {
    href: string;
    icon: React.ElementType;
    children: React.ReactNode;
    onClick?: () => void;
};

const NavLink = ({ href, icon: Icon, children, onClick }: NavLinkProps) => {
    const pathname = usePathname();
    const isActive = pathname === href || pathname.startsWith(href + '/');

    return (
        <Link
            href={href}
            onClick={onClick}
            className={`flex items-center space-x-3 rounded-lg px-4 py-3 transition-all duration-150 ${isActive
                ? "bg-blue-600 text-white shadow-lg"
                : "text-gray-600 hover:bg-gray-100"
                }`}
        >
            <Icon className="h-5 w-5" />
            <span className="font-medium">{children}</span>
        </Link>
    );
};

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const router = useRouter();
    const [username, setUsername] = useState("Admin");

    useEffect(() => {
        const userStr = localStorage.getItem("user");
        if (userStr) {
            const user = JSON.parse(userStr);
            setUsername(user.username || "Admin");
        }
    }, []);

    const handleLogout = async () => {
            const result = await Swal.fire({
                title: 'Apakah Anda yakin?',
                text: 'Anda akan keluar dari aplikasi',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3B82F6',
                confirmButtonText: 'Ya, keluar!',
                cancelButtonText: 'Batal'
            });
    
            if (result.isConfirmed) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
    
                router.push('/auth/login');
            }
        };

    return (
        <>
            <div
                className={`fixed inset-0 z-40 bg-black/50 transition-opacity md:hidden ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"
                    }`}
                onClick={onClose}
            ></div>

            <aside
                className={`
                    fixed top-0 left-0 z-50 h-screen w-64 flex-col justify-between bg-white p-4 shadow-2xl transition-transform duration-300 ease-in-out
                    md:relative md:translate-x-0 md:shadow-lg
                    ${isOpen ? "translate-x-0" : "-translate-x-full"} 
                `}
            >
                <div className="flex-1 overflow-y-auto no-scrollbar">

                    <div className="mb-6 flex items-center justify-between px-2 py-3">
                        <div className="flex items-center space-x-2">
                            <img
                                src={"/assets/icons/Profile.svg"}
                                alt="Logo DipTrack"
                                className="h-14 w-14 shadow-lg"
                            />
                            <span className="text-2xl font-bold text-blue-600">DipTrack</span>
                        </div>

                        <button
                            onClick={onClose}
                            className="rounded-full p-2 text-gray-500 hover:bg-gray-100 md:hidden"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <nav className="flex flex-col space-y-2">
                        <NavLink href="/dashboard" icon={LayoutDashboard} onClick={onClose}>Dasbor</NavLink>
                        <NavLink href="/bus" icon={Bus} onClick={onClose}>Bus</NavLink>
                        <NavLink href="/schedule" icon={CalendarDays} onClick={onClose}>Penjadwalan</NavLink>
                        <NavLink href="/drivers" icon={Users} onClick={onClose}>Sopir</NavLink>
                        <NavLink href="/route" icon={Map} onClick={onClose}>Rute</NavLink>
                        <NavLink href="/bus_stop" icon={MapPin} onClick={onClose}>Halte</NavLink>
                        <NavLink href="/maintenance" icon={Wrench} onClick={onClose}>Perawatan</NavLink>
                        <NavLink href="/analytics" icon={BarChart} onClick={onClose}>Analitik</NavLink>
                    </nav>
                </div>

                <div className="border-t border-gray-100 pt-4 mt-2">
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center justify-center space-x-2 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-500 hover:text-white transition-colors"
                    >
                        <LogOut className="h-4 w-4" />
                        <span>Keluar</span>
                    </button>
                </div>
            </aside>
        </>
    );
}