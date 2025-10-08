// src/app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <h1 className="text-4xl font-bold mb-4">Selamat Datang 👋</h1>
      <p className="text-gray-600 mb-6">
        Ini adalah halaman utama. Silakan menuju ke dashboard.
      </p>
      <Link
        href="/dashboard"
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
      >
        Buka Dashboard
      </Link>
    </div>
  );
}
