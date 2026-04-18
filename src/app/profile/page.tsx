'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    User,
    Shield,
    KeyRound,
    LogOut,
    Loader2,
    Save,
    AlertCircle,
    CheckCircle2
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
import Header from '@/components/Header';

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    // State untuk notifikasi (Sukses/Gagal)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // State form input password
    const [passData, setPassData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const getGreeting = () => {
        const hour = new Date().getHours();

        if (hour >= 5 && hour < 11) return "Selamat Pagi Admin!";
        if (hour >= 11 && hour < 15) return "Selamat Siang Admin!";
        if (hour >= 15 && hour < 18) return "Selamat Sore Admin!";
        return "Selamat Malam Admin!";
    };

    // 1. Ambil data user dari LocalStorage saat halaman dimuat
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            // Jika tidak ada user di storage, lempar ke login
            router.push('/auth/login');
        }
    }, [router]);

    // Handle ketikan di form
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassData({ ...passData, [e.target.name]: e.target.value });
    };

    // Handle Logout
    const handleLogout = () => {
        if (confirm('Yakin ingin keluar dari aplikasi?')) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            router.push('/auth/login');
        }
    };

    // --- INTEGRASI KE BACKEND (Change Password) ---
    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        // Validasi Frontend: Cek Password Baru vs Konfirmasi
        if (passData.newPassword !== passData.confirmPassword) {
            setMessage({ type: 'error', text: 'Konfirmasi password tidak cocok.' });
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');

            // Panggil API Backend
            const res = await fetch(`${API_URL}/api/auth/change-password`, {
                method: 'PUT', // Sesuai route backend Anda
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Wajib untuk authMiddleware
                },
                body: JSON.stringify({
                    oldPassword: passData.oldPassword,
                    newPassword: passData.newPassword
                })
            });

            const data = await res.json();

            if (!res.ok) {
                // Tampilkan pesan error dari backend (misal: "Password lama salah")
                throw new Error(data.message || 'Gagal mengubah password');
            }

            // Jika Berhasil
            setMessage({ type: 'success', text: data.message }); // "Password berhasil diubah"
            setPassData({ oldPassword: '', newPassword: '', confirmPassword: '' });

        } catch (err: any) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50/50 p-8">
            <Header
                subtitle={getGreeting()}
                title="Profile"
            />
            <div className="flex flex-col lg:flex-row gap-6">

                {/* --- KARTU PROFIL (KIRI) --- */}
                <div className="w-full lg:w-1/3">
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="p-8 flex flex-col items-center text-center">
                            <img
                                src={"/assets/icons/Profile.svg"}
                                alt="Profile"
                                className="h-28 w-28"
                            />

                            <h2 className="text-2xl font-bold text-gray-900">{user.username}</h2>
                            <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                <Shield className="h-3 w-3 mr-1" />
                                Administrator
                            </div>

                            <div className="mt-6 w-full grid grid-cols-2 gap-4 border-t border-gray-100 pt-6">
                                <div className="text-center">
                                    {/* Menampilkan ID Admin sesuai respon Login */}
                                    <span className="block text-xl font-bold text-gray-900">#{user.id_admin}</span>
                                    <span className="text-xs text-gray-500 uppercase tracking-wide">Admin ID</span>
                                </div>
                                <div className="text-center border-l border-gray-100">
                                    <span className="block text-xl font-bold text-green-600">Aktif</span>
                                    <span className="text-xs text-gray-500 uppercase tracking-wide">Status</span>
                                </div>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="mt-8 w-full flex items-center justify-center px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors text-sm font-medium"
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                Keluar
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- FORM GANTI PASSWORD (KANAN) --- */}
                <div className="w-full lg:w-2/3">
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                        <div className="flex items-center space-x-3 mb-6 border-b border-gray-100 pb-4">
                            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                <KeyRound className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Keamanan Akun</h3>
                                <p className="text-sm text-gray-500">Perbarui kata sandi Anda untuk menjaga keamanan.</p>
                            </div>
                        </div>

                        {/* Alert Messages */}
                        {message && (
                            <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 animate-fade-in ${message.type === 'success'
                                ? 'bg-green-50 text-green-700 border border-green-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                                }`}>
                                {message.type === 'success' ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <AlertCircle className="h-5 w-5 shrink-0" />}
                                <p className="text-sm font-medium">{message.text}</p>
                            </div>
                        )}

                        <form onSubmit={handleChangePassword} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Password Lama</label>
                                <input
                                    type="password"
                                    name="oldPassword"
                                    value={passData.oldPassword}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                                    placeholder="Masukkan password saat ini"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Password Baru</label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={passData.newPassword}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                                        placeholder="Password baru"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Konfirmasi Password</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={passData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                                        placeholder="Ulangi password baru"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20"
                                >
                                    {loading ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : <Save className="h-5 w-5 mr-2" />}
                                    Simpan Perubahan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}