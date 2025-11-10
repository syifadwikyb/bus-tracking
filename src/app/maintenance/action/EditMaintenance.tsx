'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/config";
import Link from 'next/link';
import Header from "@/components/Header";

// Fungsi untuk memformat tanggal YYYY-MM-DD
const formatDateForInput = (dateString: string | null | undefined) => {
    if (!dateString) return "";
    try {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // "YYYY-MM-DD"
    } catch {
        return "";
    }
};

// Asumsi Tipe Maintenance
interface Maintenance {
    id_maintenance: number;
    bus_id: number;
    tanggal_perbaikan: string;
    tanggal_selesai?: string | null;
    deskripsi: string;
    status: string;
    harga: number;
}
interface Bus {
    id_bus: number;
    plat_nomor: string;
    status: string;
    foto: string | null;
}

const EditMaintenance: React.FC<{ id: string }> = ({ id }) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [buses, setBuses] = useState<Bus[]>([]);
    const [selectedBus, setSelectedBus] = useState<Bus | null>(null);

    const [formData, setFormData] = useState({
        busId: "",
        tanggalMulai: "",
        tanggalSelesai: "",
        deskripsi: "",
        biaya: "",
        status: "dijadwalkan",
    });

    // 🔹 1. Ambil data bus (sama seperti Add)
    useEffect(() => {
        const fetchBuses = async () => {
            try {
                const response = await fetch(`${API_URL}/api/bus`);
                if (!response.ok) throw new Error("Gagal mengambil data bus");
                const data = await response.json();
                const busesData = Array.isArray(data) ? data : (data.data || []);
                setBuses(busesData);
            } catch (error) {
                console.error("❌ Gagal mengambil data bus:", error);
            }
        };
        fetchBuses();
    }, []);

    // 🔹 2. Ambil data maintenance yang ada
    useEffect(() => {
        if (!id) return;
        const fetchMaintenanceData = async () => {
            setLoadingData(true);
            try {
                const res = await fetch(`${API_URL}/api/maintenance/${id}`);
                if (!res.ok) throw new Error('Gagal mengambil data maintenance');

                const data: Maintenance = await res.json();

                // Isi form dengan data yang ada
                setFormData({
                    busId: data.bus_id.toString(),
                    tanggalMulai: formatDateForInput(data.tanggal_perbaikan),
                    tanggalSelesai: formatDateForInput(data.tanggal_selesai),
                    deskripsi: data.deskripsi || "",
                    biaya: data.harga ? data.harga.toString() : "",
                    status: data.status || "dijadwalkan",
                });

            } catch (error) {
                console.error("Gagal fetch data edit:", error);
                alert("Gagal memuat data. Kembali ke halaman maintenance.");
                router.push("/maintenance");
            } finally {
                setLoadingData(false);
            }
        };

        fetchMaintenanceData();
    }, [id, router]);

    // 🔹 3. Update 'selectedBus' jika busId berubah (dari fetch) atau bus list selesai loading
    useEffect(() => {
        if (formData.busId && buses.length > 0) {
            const bus = buses.find((b) => b.id_bus.toString() === formData.busId);
            setSelectedBus(bus || null);
        }
    }, [formData.busId, buses]);


    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (name === "busId") {
            const bus = buses.find((b) => b.id_bus.toString() === value);
            setSelectedBus(bus || null);
        }
    };

    // 🔹 4. Submit form (PUT request)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                bus_id: formData.busId,
                tanggal_perbaikan: formData.tanggalMulai,
                tanggal_selesai: formData.tanggalSelesai || null,
                deskripsi: formData.deskripsi || "",
                harga: formData.biaya ? Number(formData.biaya) : null,
                status: formData.status,
            };

            const response = await fetch(`${API_URL}/api/maintenance/${id}`, { // <-- Gunakan ID
                method: "PUT", // <-- Gunakan PUT
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const result = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(result.message || "Gagal memperbarui data");
            }

            alert("✅ Data maintenance berhasil diperbarui!");
            router.push("/maintenance");
        } catch (error) {
            console.error("❌ Gagal memperbarui data:", error);
            alert("❌ Terjadi kesalahan saat memperbarui data.");
        } finally {
            setLoading(false);
        }
    };

    if (loadingData) {
        return <div className="p-6 text-center">Memuat data...</div>;
    }

    return (
        <div className="">
            <Header />
            <div className="p-6 bg-white rounded-2xl shadow-md">
                <p className="text-sm text-gray-500 mb-6" aria-label="breadcrumb">
                    <Link href="/maintenance"
                        className="hover:text-blue-600 hover:underline transition-colors">
                        Management Maintenance
                    </Link>
                    <span className="mx-2">/</span>
                    <span className="font-medium text-gray-700">
                        Edit Maintenance
                    </span>
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                    {/* Kolom kiri (Form) */}
                    <div className="space-y-4">
                        <div>
                            <label className="block font-medium mb-1">Nomor Polisi</label>
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
                        </div>

                        <div>
                            <label className="block font-medium mb-1">Tanggal Mulai</label>
                            <input
                                type="date"
                                name="tanggalMulai"
                                value={formData.tanggalMulai}
                                onChange={handleChange}
                                className="w-full border border-blue-400 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                required
                            />
                        </div>

                        <div>
                            <label className="block font-medium mb-1">Tanggal Selesai (opsional)</label>
                            <input
                                type="date"
                                name="tanggalSelesai"
                                value={formData.tanggalSelesai}
                                onChange={handleChange}
                                className="w-full border border-blue-400 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>

                        <div>
                            <label className="block font-medium mb-1">Deskripsi (opsional)</label>
                            <textarea
                                name="deskripsi"
                                rows={4}
                                value={formData.deskripsi}
                                onChange={handleChange}
                                placeholder="Tuliskan deskripsi maintenance..."
                                className="w-full border border-blue-400 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                    </div>

                    {/* Kolom kanan (Preview & Biaya) */}
                    <div className="space-y-4">
                        <div className="flex flex-col items-center border border-blue-300 rounded-xl p-3">
                            {selectedBus?.foto ? (
                                <img
                                    src={`${API_URL}/uploads/${selectedBus.foto}`}
                                    alt="Foto Bus"
                                    className="w-48 h-32 object-cover rounded-md"
                                />
                            ) : (
                                <div className="w-48 h-32 bg-gray-200 flex items-center justify-center rounded-md text-gray-500">
                                    Tidak ada foto
                                </div>
                            )}
                            <p className="mt-2 font-medium text-gray-700">
                                {selectedBus ? selectedBus.plat_nomor : "..."}
                            </p>
                            <p className="text-sm text-gray-500">
                                {selectedBus ? selectedBus.status : "..."}
                            </p>
                        </div>

                        <div>
                            <label className="block font-medium mb-1">Biaya (opsional)</label>
                            <input
                                type="number"
                                name="biaya"
                                value={formData.biaya}
                                onChange={handleChange}
                                placeholder="Masukkan biaya (Rp)"
                                className="w-full border border-blue-400 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>

                        <div>
                            <label className="block font-medium mb-1">Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full border border-blue-400 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                required
                            >
                                <option value="dijadwalkan">Dijadwalkan</option>
                                <option value="sedang diperbaiki">Sedang Diperbaiki</option>
                                <option value="selesai">Selesai</option>
                            </select>
                        </div>
                    </div>

                    {/* Tombol Aksi */}
                    <div className="col-span-2 flex justify-end space-x-3 mt-4">
                        <Link
                            href="/maintenance"
                            className="bg-red-100 text-red-600 px-6 py-2 rounded-xl font-medium hover:bg-red-200"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-6 py-2 rounded-xl font-medium text-teal-700 ${loading
                                ? "bg-teal-50 cursor-not-allowed"
                                : "bg-teal-100 hover:bg-teal-200"
                                }`}
                        >
                            {loading ? "Memperbarui..." : "Perbarui"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditMaintenance;