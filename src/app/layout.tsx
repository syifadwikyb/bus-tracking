// File: src/app/layout.tsx
import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import ClientLayout from "./ClientLayout";
import SessionGuard from "@/components/SessionGuard";

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-quicksand",
});

export const metadata: Metadata = {
  title: "DipTrack",
  description: "Sistem Pemantauan Bus Universitas Diponegoro",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${quicksand.variable} font-sans antialiased`}>
        <SessionGuard>
          <ClientLayout>
             {children}
          </ClientLayout>
        </SessionGuard>

      </body>
    </html>
  );
}