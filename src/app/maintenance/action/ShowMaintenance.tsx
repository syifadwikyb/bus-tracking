'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/config";
import Link from 'next/link';
import Header from "@/components/Header";

// Fungsi format tanggal (sama seperti Edit)
const formatDateForInput = (dateString: string | null | undefined) => {
    if (!dateString) return "";
    try {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // "YYYY-MM-DD"
    } catch {
        return "";
    }
};

// Asumsi Tipe (sama seperti Edit)
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

const ShowMaintenance: React.FC<{ id: string }> = ({ id }) => {
    const router = useRouter();
    const [loadingData, setLoadingData] = useState(true);
    const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
    const [formData, setFormData] = useState({
        busId: "",
        tanggalMulai: "",
        tanggalSelesai: "",
        deskripsi: "",
        biaya: "",
        status: "dijadwalkan",
    });

    // 🔹 Ambil data maintenance dan bus terkait
    useEffect(() => {
        if (!id) return;
        const fetchMaintenanceData = async () => {
            setLoadingData(true);
            try {
                const res = await fetch(`${API_URL}/api/maintenance/${id}`);
                if (!res.ok) throw new Error('Gagal mengambil data maintenance');

                // Ambil data maintenance (termasuk bus)
                const data: Maintenance & { bus?: Bus } = await res.json();

                setFormData({
                    busId: data.bus_id.toString(),
                    tanggalMulai: formatDateForInput(data.tanggal_perbaikan),
                    tanggalSelesai: formatDateForInput(data.tanggal_selesai),
                    deskripsi: data.deskripsi || "",
                    biaya: data.harga ? data.harga.toString() : "",
                    status: data.status || "dijadwalkan",
                });

                if (data.bus) {
                    setSelectedBus(data.bus);
                }

            } catch (error) {
                console.error("Gagal fetch data:", error);
                alert("Gagal memuat data. Kembali ke halaman maintenance.");
                router.push("/maintenance");
            } finally {
                setLoadingData(false);
            }
        };

        fetchMaintenanceData();
    }, [id, router]);


    if (loadingData) {
        return <div className="p-6 text-center">Memuat data...</div>;
    }

    // Set properti disabled untuk semua field
    const isDisabled = true;

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
                        Detail Maintenance
                    </span>
                </p>

                <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Kolom kiri (Form) */}
                    <div className="space-y-4">
                        <div>
                            <label className="block font-medium mb-1">Nomor Polisi</label>
                            <input
                                type="text"
                                value={selectedBus?.plat_nomor || 'Memuat...'}
                                disabled={isDisabled}
                                className="w-full border border-blue-400 rounded-xl p-2 bg-gray-50"
                            />
                        </div>

                        <div>
                            <label className="block font-medium mb-1">Tanggal Mulai</label>
                            <input
                                type="date"
                                name="tanggalMulai"
                                value={formData.tanggalMulai}
                                disabled={isDisabled}
                                className="w-full border border-blue-400 rounded-xl p-2 bg-gray-50"
                            />
                        </div>

                        <div>
                            <label className="block font-medium mb-1">Tanggal Selesai</label>
                            <input
                                type="date"
                                name="tanggalSelesai"
                                value={formData.tanggalSelesai}
                                disabled={isDisabled}
                                className="w-full border border-blue-400 rounded-xl p-2 bg-gray-50"
                            />
                        </div>

                        <div>
                            <label className="block font-medium mb-1">Deskripsi</label>
                            <textarea
                                name="deskripsi"
                                rows={4}
                                value={formData.deskripsi}
                                disabled={isDisabled}
                                className="w-full border border-blue-400 rounded-xl p-2 bg-gray-50"
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
                            <label className="block font-medium mb-1">Biaya (Rp)</label>
                            <input
                                type="number"
                                name="biaya"
                                value={formData.biaya}
                                disabled={isDisabled}
                                className="w-full border border-blue-400 rounded-xl p-2 bg-gray-50"
                            />
                        </div>

                        <div>
                            <label className="block font-medium mb-1">Status</label>
                            <input
                                type="text"
                                name="status"
                                value={formData.status}
                                disabled={isDisabled}
                                className="w-full border border-blue-400 rounded-xl p-2 bg-gray-50 capitalize"
                            />
                        </div>
                    </div>

                    {/* Tombol Aksi */}
                    <div className="col-span-2 flex justify-end space-x-3 mt-4">
                        <Link
                            href="/maintenance"
                            className="bg-gray-100 text-gray-700 px-6 py-2 rounded-xl font-medium hover:bg-gray-200"
                        >
                            Kembali
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ShowMaintenance;