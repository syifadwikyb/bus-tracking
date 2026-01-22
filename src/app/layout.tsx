// File: src/app/layout.tsx
import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import ClientLayout from "./ClientLayout"; // ✅ Import ClientLayout

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-quicksand",
});

export const metadata: Metadata = {
  title: "BusTrack - Management System",
  description: "Bus Management System Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${quicksand.variable} font-sans antialiased`}>
        {/* ✅ Gunakan ClientLayout untuk membungkus children */}
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}