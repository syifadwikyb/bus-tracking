'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import Header from "@/components/Header";
import Swal from 'sweetalert2';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Interface tipe data
interface Bus {
    id_bus: number;
    plat_nomor: string;
    status: string;
    foto: string | null;
}

interface Driver {
    id_driver: number;
    nama: string;
    status: string;
}

interface Jalur {
    id_jalur: number;
    nama_jalur: string;
    status: string;
}

export default function AddSchedule() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);

    // State untuk Data List
    const [buses, setBuses] = useState<Bus[]>([]);
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [jalurs, setJalurs] = useState<Jalur[]>([]);

    // State untuk Preview
    const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
    const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
    const [selectedJalur, setSelectedJalur] = useState<Jalur | null>(null);

    const [formData, setFormData] = useState({
        busId: "",
        driverId: "",
        jalurId: "",
        tanggal: "",
        jamMulai: "",
        jamSelesai: "",
    });

    // 🔹 Ambil data Bus, Driver, dan Jalur
    useEffect(() => {
        async function fetchData() {
            try {
                // 1. Fetch Bus
                const busRes = await fetch(`${API_URL}/api/bus`);
                const busDataRaw = await busRes.json();
                const busList = Array.isArray(busDataRaw) ? busDataRaw : (busDataRaw.data || []);
                const availableBuses = busList.filter((b: Bus) =>
                    ['berhenti'].includes(b.status.toLowerCase())
                );
                setBuses(availableBuses);

                // 2. Fetch Driver
                const driverRes = await fetch(`${API_URL}/api/drivers`);
                const driverDataRaw = await driverRes.json();
                const driverList = Array.isArray(driverDataRaw) ? driverDataRaw : (driverDataRaw.data || []);
                const availableDrivers = driverList.filter((d: Driver) =>
                    ['berhenti'].includes(d.status.toLowerCase())
                );
                setDrivers(availableDrivers);

                // 3. Fetch Jalur
                const jalurRes = await fetch(`${API_URL}/api/jalur`);
                const jalurDataRaw = await jalurRes.json();
                const jalurList = Array.isArray(jalurDataRaw) ? jalurDataRaw : (jalurDataRaw.data || []);
                const availableJalurs = jalurList.filter((j: Jalur) =>
                    ['berjalan'].includes(j.status.toLowerCase())
                );
                setJalurs(availableJalurs);

            } catch (error) {
                console.error("❌ Gagal mengambil data referensi:", error);
            } finally {
                setLoadingData(false);
            }
        }

        fetchData();
    }, []);

    // 🔹 Handle input change
    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Update Preview
        if (name === "busId") {
            const bus = buses.find((b) => b.id_bus.toString() === value);
            setSelectedBus(bus || null);
        }
        if (name === "driverId") {
            const driver = drivers.find((d) => d.id_driver.toString() === value);
            setSelectedDriver(driver || null);
        }
        if (name === "jalurId") {
            const jalur = jalurs.find((j) => j.id_jalur.toString() === value);
            setSelectedJalur(jalur || null);
        }
    }

    // 🔹 Submit form
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        // Validasi
        if (!formData.busId || !formData.driverId || !formData.jalurId) {
            alert("⚠️ Harap pilih Bus, Driver, dan Jalur!");
            return;
        }

        setLoading(true);

        try {
            const payload = {
                bus_id: formData.busId,
                driver_id: formData.driverId,
                jalur_id: formData.jalurId,
                tanggal: formData.tanggal,
                jam_mulai: formData.jamMulai,
                jam_selesai: formData.jamSelesai,
            };

            console.log("📤 Mengirim jadwal:", payload);

            const response = await fetch(`${API_URL}/api/schedules`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const result = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(result.message || "Gagal menyimpan jadwal");
            }

            Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: 'Jadwal berhasil ditambahkan!',
                confirmButtonText: 'OK',
                confirmButtonColor: '#3B82F6'
            }).then((result) => {
                if (result.isConfirmed) {
                    router.push("/schedule");
                }
            });
        } catch (error: any) {
            console.error("❌ Gagal simpan:", error);
            alert(`❌ Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    }

    // 🔹 Reset form
    function handleReset() {
        setFormData({
            busId: "",
            driverId: "",
            jalurId: "",
            tanggal: "",
            jamMulai: "",
            jamSelesai: "",
        });
        setSelectedBus(null);
        setSelectedDriver(null);
        setSelectedJalur(null);
    }

    function getGreeting() {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 11) return "Selamat Pagi Admin!";
        if (hour >= 11 && hour < 15) return "Selamat Siang Admin!";
        if (hour >= 15 && hour < 18) return "Selamat Sore Admin!";
        return "Selamat Malam Admin!";
    }

    return (
        <div className="">
            <Header
                subtitle={getGreeting()}
                title="Tambah Jadwal Perjalanan"
            />

            <div className="p-6 bg-white rounded-2xl shadow-md">
                {/* Breadcrumb */}
                <p className="text-sm text-gray-500 mb-6" aria-label="breadcrumb">
                    <Link href="/schedule"
                        className="hover:text-blue-600 hover:underline transition-colors">
                        Manajemen Jadwal
                    </Link>
                    <span className="mx-2">/</span>
                    <span className="font-medium text-gray-700">
                        Tambah Jadwal
                    </span>
                </p>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* --- KOLOM KIRI (Form Input) --- */}
                    <div className="space-y-4">

                        {/* Pilih Bus */}
                        <div>
                            <label className="block font-medium mb-1">Pilih Bus</label>
                            {loadingData ? (
                                <p className="text-sm text-gray-400">Memuat data...</p>
                            ) : (
                                <select
                                    name="busId"
                                    value={formData.busId}
                                    onChange={handleChange}
                                    className="w-full border border-blue-400 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    required
                                >
                                    <option value="">-- Pilih Bus --</option>
                                    {buses.map((bus) => (
                                        <option key={bus.id_bus} value={bus.id_bus}>
                                            {bus.plat_nomor} ({bus.status})
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>

                        {/* Pilih Driver */}
                        <div>
                            <label className="block font-medium mb-1">Pilih Driver</label>
                            {loadingData ? (
                                <p className="text-sm text-gray-400">Memuat data...</p>
                            ) : (
                                <select
                                    name="driverId"
                                    value={formData.driverId}
                                    onChange={handleChange}
                                    className="w-full border border-blue-400 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    required
                                >
                                    <option value="">-- Pilih Driver --</option>
                                    {drivers.map((driver) => (
                                        <option key={driver.id_driver} value={driver.id_driver}>
                                            {driver.nama}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>

                        {/* Pilih Jalur */}
                        <div>
                            <label className="block font-medium mb-1">Pilih Jalur (Rute)</label>
                            {loadingData ? (
                                <p className="text-sm text-gray-400">Memuat data...</p>
                            ) : (
                                <select
                                    name="jalurId"
                                    value={formData.jalurId}
                                    onChange={handleChange}
                                    className="w-full border border-blue-400 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    required
                                >
                                    <option value="">-- Pilih Jalur --</option>
                                    {jalurs.map((jalur) => (
                                        <option key={jalur.id_jalur} value={jalur.id_jalur}>
                                            {jalur.nama_jalur}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>

                        {/* Tanggal */}
                        <div>
                            <label className="block font-medium mb-1">Tanggal Keberangkatan</label>
                            <input
                                type="date"
                                name="tanggal"
                                value={formData.tanggal}
                                onChange={handleChange}
                                className="w-full border border-blue-400 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                required
                            />
                        </div>

                        {/* Jam Mulai & Selesai */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block font-medium mb-1">Jam Mulai</label>
                                <input
                                    type="time"
                                    name="jamMulai"
                                    value={formData.jamMulai}
                                    onChange={handleChange}
                                    className="w-full border border-blue-400 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block font-medium mb-1">Jam Selesai</label>
                                <input
                                    type="time"
                                    name="jamSelesai"
                                    value={formData.jamSelesai}
                                    onChange={handleChange}
                                    className="w-full border border-blue-400 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    required
                                />
                            </div>
                        </div>

                        {/* ❌ Input Status DIHAPUS karena otomatis */}
                    </div>

                    {/* --- KOLOM KANAN (Preview) --- */}
                    <div className="space-y-4">
                        <div className="flex flex-col items-center border border-blue-300 rounded-xl p-6 h-full bg-gray-50">

                            <h3 className="text-lg font-semibold text-gray-700 mb-4">Preview Jadwal</h3>

                            {/* Foto Bus */}
                            <div className="mb-4">
                                {selectedBus?.foto ? (
                                    <img
                                        src={`${API_URL}/uploads/${selectedBus.foto}`}
                                        alt="Foto Bus"
                                        className="w-64 h-40 object-cover rounded-lg shadow-sm"
                                    />
                                ) : (
                                    <div className="w-64 h-40 bg-gray-200 flex items-center justify-center rounded-lg text-gray-500 shadow-inner">
                                        Tidak ada foto bus
                                    </div>
                                )}
                            </div>

                            {/* Info Detail Preview */}
                            <div className="w-full space-y-3 px-4">
                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-gray-500">Bus:</span>
                                    <span className="font-medium text-gray-800">
                                        {selectedBus ? selectedBus.plat_nomor : "-"}
                                    </span>
                                </div>
                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-gray-500">Driver:</span>
                                    <span className="font-medium text-gray-800">
                                        {selectedDriver ? selectedDriver.nama : "-"}
                                    </span>
                                </div>
                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-gray-500">Jalur:</span>
                                    <span className="font-medium text-gray-800 text-right text-sm">
                                        {selectedJalur ? `${selectedJalur.nama_jalur}` : "-"}
                                    </span>
                                </div>
                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-gray-500">Tanggal:</span>
                                    <span className="font-medium text-gray-800">
                                        {formData.tanggal || "-"}
                                    </span>
                                </div>
                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-gray-500">Waktu:</span>
                                    <span className="font-medium text-gray-800">
                                        {formData.jamMulai && formData.jamSelesai
                                            ? `${formData.jamMulai} - ${formData.jamSelesai}`
                                            : "-"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- TOMBOL AKSI --- */}
                    <div className="col-span-1 md:col-span-2 flex justify-end space-x-3 mt-4 pt-4 border-t">
                        <button
                            type="button"
                            onClick={handleReset}
                            className="bg-red-100 text-red-600 px-6 py-2 rounded-xl font-medium hover:bg-red-200 transition"
                        >
                            Batal
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-6 py-2 rounded-xl font-medium text-teal-700 transition ${loading
                                ? "bg-teal-50 cursor-not-allowed"
                                : "bg-teal-100 hover:bg-teal-200"
                                }`}
                        >
                            {loading ? "Menyimpan..." : "Simpan Jadwal"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}