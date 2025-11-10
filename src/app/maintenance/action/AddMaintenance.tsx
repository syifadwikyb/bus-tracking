'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/config";
import Link from 'next/link';
import Header from "@/components/Header";

const AddMaintenance: React.FC = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [loadingBus, setLoadingBus] = useState(true);
    const [buses, setBuses] = useState<
        { id_bus: number; plat_nomor: string; status: string; foto: string | null }[]
    >([]);

    const [selectedBus, setSelectedBus] = useState<{
        plat_nomor: string;
        foto: string | null;
        status: string;
    } | null>(null);

    const [formData, setFormData] = useState({
        busId: "",
        tanggalMulai: "",
        tanggalSelesai: "",
        deskripsi: "",
        biaya: "",
        status: "", // 🔹 Awalnya kosong agar wajib dipilih
    });

    // 🔹 Ambil data bus
    useEffect(() => {
        const fetchBuses = async () => {
            try {
                const response = await fetch(`${API_URL}/api/bus`);
                if (!response.ok) throw new Error("Gagal mengambil data bus");

                const data = await response.json();
                console.log("📦 Data bus dari API:", data);

                const busesData = Array.isArray(data)
                    ? data
                    : Array.isArray(data.data)
                        ? data.data
                        : [];

                const availableBuses = busesData.filter(
                    (bus: any) =>
                        bus.status?.toLowerCase() === "berhenti" ||
                        bus.status?.toLowerCase() === "berjalan" ||
                        bus.status?.toLowerCase() === "dalam perbaikan"
                );

                setBuses(availableBuses);
            } catch (error) {
                console.error("❌ Gagal mengambil data bus:", error);
            } finally {
                setLoadingBus(false);
            }
        };

        fetchBuses();
    }, []);

    // 🔹 Handle input
    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (name === "busId") {
            const bus = buses.find((b) => b.id_bus.toString() === value);
            setSelectedBus(bus || null);
        }
    };

    // 🔹 Submit form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 🔒 Validasi sebelum submit
        if (!formData.busId) {
            alert("⚠️ Silakan pilih bus terlebih dahulu!");
            return;
        }
        if (!formData.status) {
            alert("⚠️ Silakan pilih status maintenance!");
            return;
        }

        setLoading(true);

        try {
            const payload = {
                bus_id: formData.busId,
                tanggal_perbaikan: formData.tanggalMulai,
                tanggal_selesai: formData.tanggalSelesai || null,
                deskripsi: formData.deskripsi || "",
                harga: formData.biaya ? Number(formData.biaya) : null,
                status:
                    formData.status.toLowerCase() === "dalam proses"
                        ? "sedang diperbaiki"
                        : formData.status.toLowerCase() === "selesai"
                            ? "selesai"
                            : "dijadwalkan",
            };

            console.log("📤 Data dikirim ke server:", payload);

            const response = await fetch(`${API_URL}/api/maintenance`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const result = await response.json().catch(() => ({}));
            console.log("Response status:", response.status, "→", result);

            if (!response.ok) {
                throw new Error(result.message || "Gagal menyimpan data maintenance");
            }

            alert("✅ Data maintenance berhasil disimpan!");
            router.push("/maintenance");
        } catch (error) {
            console.error("❌ Gagal menyimpan data:", error);
            alert("❌ Terjadi kesalahan saat menyimpan data maintenance.");
        } finally {
            setLoading(false);
        }
    };

    // 🔹 Reset form
    const handleReset = () => {
        setFormData({
            busId: "",
            tanggalMulai: "",
            tanggalSelesai: "",
            deskripsi: "",
            biaya: "",
            status: "",
        });
        setSelectedBus(null);
    };

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
                    {/* Kolom kiri */}
                    <div className="space-y-4">
                        <div>
                            <label className="block font-medium mb-1">Nomor Polisi</label>
                            {loadingBus ? (
                                <p className="text-sm text-gray-500">Memuat daftar bus...</p>
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
                            <label className="block font-medium mb-1">
                                Tanggal Selesai (opsional)
                            </label>
                            <input
                                type="date"
                                name="tanggalSelesai"
                                value={formData.tanggalSelesai}
                                onChange={handleChange}
                                className="w-full border border-blue-400 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>

                        <div>
                            <label className="block font-medium mb-1">
                                Deskripsi (opsional)
                            </label>
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

                    {/* Kolom kanan */}
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
                                {selectedBus ? selectedBus.plat_nomor : "Belum ada bus dipilih"}
                            </p>

                            <p className="text-sm text-gray-500">
                                {selectedBus ? selectedBus.status : "Silakan pilih bus dari daftar"}
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
                            <label className="block font-medium mb-1">Status <span className="text-red-500">*</span></label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full border border-blue-400 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                required
                            >
                                <option value="">-- Pilih Status --</option>
                                <option value="Dijadwalkan">Dijadwalkan</option>
                                <option value="Dalam Proses">Dalam Proses</option>
                                <option value="Selesai">Selesai</option>
                            </select>
                        </div>
                    </div>

                    <div className="col-span-2 flex justify-end space-x-3 mt-4">
                        <button
                            type="button"
                            onClick={handleReset}
                            className="bg-red-100 text-red-600 px-6 py-2 rounded-xl font-medium hover:bg-red-200"
                        >
                            Batal
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-6 py-2 rounded-xl font-medium text-teal-700 ${loading
                                ? "bg-teal-50 cursor-not-allowed"
                                : "bg-teal-100 hover:bg-teal-200"
                                }`}
                        >
                            {loading ? "Menyimpan..." : "Simpan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddMaintenance;
