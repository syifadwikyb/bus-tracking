'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { API_URL } from '@/lib/config';
import { User, Lock, Loader2, Bus, ShieldCheck, ArrowRight, MapPin } from 'lucide-react';

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError("Password konfirmasi tidak cocok");
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: formData.username,
                    password: formData.password
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Registrasi gagal');
            }

            alert("Registrasi Berhasil! Silakan Login.");
            router.push('/auth/login');

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full bg-white">
            {/* BAGIAN KIRI: Visual & Branding (Nuansa sedikit berbeda dari Login) */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-blue-600 flex-col justify-between p-12 overflow-hidden">
                {/* Background Pattern Abstrak (Peta Jalur) */}
                <div className="absolute inset-0 opacity-10">
                    <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
                        <circle cx="20" cy="50" r="2" fill="white" />
                        <circle cx="80" cy="30" r="2" fill="white" />
                        <path d="M20 50 Q 50 10 80 30" stroke="white" strokeWidth="0.5" fill="none" />
                    </svg>
                </div>

                {/* Dekorasi lingkaran (efek radar) */}
                <div className="absolute top-1/4 left-1/4 h-64 w-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 h-64 w-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse delay-700"></div>

                {/* Konten Branding */}
                <div className="relative z-10">
                    <div className="flex items-center space-x-3">
                        <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                            <Bus className="h-8 w-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-white tracking-wide">DipTrack</h1>
                    </div>
                </div>

                <div className="relative z-10 text-white space-y-4 max-w-lg">
                    <h2 className="text-4xl font-bold leading-tight">
                        Pantau Armada Bus Universitas Diponegoro secara <span className="text-blue-200">Real-Time</span>
                    </h2>
                    <p className="text-blue-100 text-lg">
                        Solusi manajemen transportasi cerdas untuk efisiensi jadwal, pemantauan rute, dan keselamatan penumpang.
                    </p>

                    {/* Fitur Highlights Kecil */}
                    <div className="flex gap-4 mt-8 pt-8 border-t border-blue-400/30">
                        <div className="flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-blue-200" />
                            <span className="text-sm font-medium">Live GPS</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-green-400"></div>
                            <span className="text-sm font-medium">99.9% Uptime</span>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 text-blue-200 text-sm">
                    © 2026 DipTrack Management System
                </div>
            </div>

            {/* BAGIAN KANAN: Form Register */}
            <div className="flex w-full lg:w-1/2 items-center justify-center p-8 bg-gray-50">
                <div className="w-full max-w-md space-y-4 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl text-center font-extrabold text-gray-900">DipTrack</h2>
                        <p className="mt-2 text-gray-500">Isi data di bawah untuk mendapatkan akses admin.</p>
                    </div>

                    {error && (
                        <div className="flex items-center gap-3 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r shadow-sm">
                            <p className="text-sm font-medium">{error}</p>
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {/* Username */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-600">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    name="username"
                                    type="text"
                                    required
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all duration-200"
                                    placeholder="Username"
                                    value={formData.username}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-600">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all duration-200"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-600">
                                    <ShieldCheck className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all duration-200"
                                    placeholder="Konfirmasi Password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all duration-200"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin h-5 w-5" />
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Daftar Sekarang <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Sudah memiliki akun?{' '}
                            <Link href="/auth/login" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
                                Masuk disini
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}