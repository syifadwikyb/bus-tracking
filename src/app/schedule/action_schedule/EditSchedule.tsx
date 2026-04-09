'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/config";
import Link from 'next/link';
import Header from "@/components/Header";
import Swal from 'sweetalert2';

interface Bus { id_bus: number; plat_nomor: string; status: string; foto: string | null; }
interface Driver { id_driver: number; nama: string; status: string; }
interface Jalur { id_jalur: number; nama_jalur: string; asal?: string; tujuan?: string; kota_asal?: string; kota_tujuan?: string; }

export default function EditSchedule({ id }: { id: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);

    // Data Master
    const [buses, setBuses] = useState<Bus[]>([]);
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [jalurs, setJalurs] = useState<Jalur[]>([]);

    // Preview
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
        status: "",
    });

    // Fetch Data
    useEffect(() => {
        async function fetchAllData() {
            try {
                // A. Fetch Master Data
                const [busRes, driverRes, jalurRes] = await Promise.all([
                    fetch(`${API_URL}/api/bus`),
                    fetch(`${API_URL}/api/drivers`),
                    fetch(`${API_URL}/api/jalur`)
                ]);

                const busData = await busRes.json();
                const driverData = await driverRes.json();
                const jalurData = await jalurRes.json();

                const busList = Array.isArray(busData) ? busData : (busData.data || []);
                setBuses(busList);

                const driverList = Array.isArray(driverData) ? driverData : (driverData.data || []);
                setDrivers(driverList);

                const jalurList = Array.isArray(jalurData) ? jalurData : (jalurData.data || []);
                setJalurs(jalurList);

                // B. Fetch Data Jadwal Existing
                const scheduleRes = await fetch(`${API_URL}/api/schedules/${id}`);
                if (!scheduleRes.ok) throw new Error("Gagal mengambil data jadwal");

                const scheduleData = await scheduleRes.json();
                const s = scheduleData.data || scheduleData;

                // C. Isi Form
                setFormData({
                    busId: s.bus_id?.toString() || "",
                    driverId: s.driver_id?.toString() || "",
                    jalurId: s.jalur_id?.toString() || "",
                    tanggal: s.tanggal ? new Date(s.tanggal).toISOString().split('T')[0] : "",
                    jamMulai: s.jam_mulai || "",
                    jamSelesai: s.jam_selesai || "",
                    status: s.status || "dijadwalkan",
                });

                // D. Set Preview Awal
                if (s.bus_id) setSelectedBus(busList.find((b: Bus) => b.id_bus == s.bus_id) || null);
                if (s.driver_id) setSelectedDriver(driverList.find((d: Driver) => d.id_driver == s.driver_id) || null);
                if (s.jalur_id) setSelectedJalur(jalurList.find((j: Jalur) => j.id_jalur == s.jalur_id) || null);

            } catch (error) {
                console.error(error);
                Swal.fire({
                    icon: 'error',
                    title: 'Tidak Ditemukan',
                    text: 'Jadwal tidak ditemukan atau terjadi kesalahan.',
                    confirmButtonColor: '#EF4444',
                    confirmButtonText: 'Kembali'
                }).then(() => {
                    router.push("/schedule");
                });
            } finally {
                setLoadingData(false);
            }
        }

        if (id) fetchAllData();
    }, [id, router]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (name === "busId") setSelectedBus(buses.find((b) => b.id_bus.toString() === value) || null);
        if (name === "driverId") setSelectedDriver(drivers.find((d) => d.id_driver.toString() === value) || null);
        if (name === "jalurId") setSelectedJalur(jalurs.find((j) => j.id_jalur.toString() === value) || null);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                bus_id: formData.busId,
                driver_id: formData.driverId,
                jalur_id: formData.jalurId,
                tanggal: formData.tanggal,
                jam_mulai: formData.jamMulai,
                jam_selesai: formData.jamSelesai,
                status: formData.status
            };

            const response = await fetch(`${API_URL}/api/schedules/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error("Gagal update jadwal");

            Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: 'Jadwal berhasil diperbarui!',
                confirmButtonText: 'OK',
                confirmButtonColor: '#3B82F6'
            }).then((result) => {
                if (result.isConfirmed) {
                    router.push("/schedule");
                }
            });
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Gagal Memperbarui',
                text: 'Terjadi kesalahan saat memperbarui jadwal.',
                confirmButtonColor: '#EF4444',
                confirmButtonText: 'Tutup'
            });
        } finally {
            setLoading(false);
        }
    }

    if (loadingData) return <div className="p-10 text-center">Memuat data edit...</div>;

    return (
        <div className="">
            <Header subtitle="Edit Jadwal" title="Edit Jadwal Perjalanan" />
            <div className="p-6 bg-white rounded-2xl shadow-md">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* KOLOM KIRI */}
                    <div className="space-y-4">
                        <div>
                            <label className="block font-medium mb-1">Pilih Bus</label>
                            <select name="busId" value={formData.busId} onChange={handleChange} className="w-full border border-blue-400 rounded-xl p-2" required>
                                <option value="">-- Pilih Bus --</option>
                                {buses.map((bus) => (
                                    <option key={bus.id_bus} value={bus.id_bus}>{bus.plat_nomor}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Pilih Driver</label>
                            <select name="driverId" value={formData.driverId} onChange={handleChange} className="w-full border border-blue-400 rounded-xl p-2" required>
                                <option value="">-- Pilih Driver --</option>
                                {drivers.map((driver) => (
                                    <option key={driver.id_driver} value={driver.id_driver}>{driver.nama}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Pilih Jalur</label>
                            <select name="jalurId" value={formData.jalurId} onChange={handleChange} className="w-full border border-blue-400 rounded-xl p-2" required>
                                <option value="">-- Pilih Jalur --</option>
                                {jalurs.map((jalur) => (
                                    <option key={jalur.id_jalur} value={jalur.id_jalur}>
                                        {jalur.nama_jalur}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Tanggal</label>
                            <input type="date" name="tanggal" value={formData.tanggal} onChange={handleChange} className="w-full border border-blue-400 rounded-xl p-2" required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block font-medium mb-1">Jam Mulai</label>
                                <input type="time" name="jamMulai" value={formData.jamMulai} onChange={handleChange} className="w-full border border-blue-400 rounded-xl p-2" required />
                            </div>
                            <div>
                                <label className="block font-medium mb-1">Jam Selesai</label>
                                <input type="time" name="jamSelesai" value={formData.jamSelesai} onChange={handleChange} className="w-full border border-blue-400 rounded-xl p-2" required />
                            </div>
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Status</label>
                            <select name="status" value={formData.status} onChange={handleChange} className="w-full border border-blue-400 rounded-xl p-2" required>
                                <option value="dijadwalkan">Dijadwalkan</option>
                                <option value="berjalan">Berjalan</option>
                                <option value="selesai">Selesai</option>
                            </select>
                        </div>
                    </div>

                    {/* KOLOM KANAN */}
                    <div className="space-y-4">
                        <div className="flex flex-col items-center border border-blue-300 rounded-xl p-6 h-full bg-gray-50">
                            <h3 className="text-lg font-semibold text-gray-700 mb-4">Preview Edit</h3>
                            {selectedBus?.foto ? (
                                <img src={`${API_URL}/uploads/${selectedBus.foto}`} className="w-64 h-40 object-cover rounded-lg shadow-sm mb-4" alt="Bus" />
                            ) : <div className="w-64 h-40 bg-gray-200 flex items-center justify-center rounded-lg mb-4">No Photo</div>}

                            <div className="w-full space-y-3 px-4">
                                <p className="flex justify-between border-b pb-2"><span className="text-gray-500">Bus:</span> <span className="font-medium">{selectedBus?.plat_nomor}</span></p>
                                <p className="flex justify-between border-b pb-2"><span className="text-gray-500">Driver:</span> <span className="font-medium">{selectedDriver?.nama}</span></p>
                                <p className="flex justify-between border-b pb-2"><span className="text-gray-500">Jalur:</span> <span className="font-medium text-sm">{selectedJalur?.nama_jalur}</span></p>
                                <p className="flex justify-between border-b pb-2"><span className="text-gray-500">Status:</span> <span className="font-bold uppercase text-blue-600">{formData.status}</span></p>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-1 md:col-span-2 flex justify-end space-x-3 mt-4 pt-4 border-t">
                        <Link href="/schedule" className="bg-red-100 text-red-600 px-6 py-2 rounded-xl font-medium hover:bg-red-200">Batal</Link>
                        <button type="submit" disabled={loading} className="bg-teal-100 text-teal-700 px-6 py-2 rounded-xl font-medium hover:bg-teal-200">
                            {loading ? "Menyimpan..." : "Update Jadwal"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}