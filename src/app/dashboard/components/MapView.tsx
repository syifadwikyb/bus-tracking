"use client";

import React, { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { useMap } from "react-leaflet";
import type { Bus } from "../DashboardClient";

// ===== Dynamic Import (WAJIB untuk Next.js) =====
const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((m) => m.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((m) => m.Popup),
  { ssr: false }
);
const Polyline = dynamic(
  () => import("react-leaflet").then((m) => m.Polyline),
  { ssr: false }
);

// ===== Props =====
interface MapViewProps {
  buses: Bus[];
  selectedRoute: any;
  onBusClick: (bus: Bus) => void;
}

// ✅ COMPONENT: Hanya Zoom ke Rute saat Rute Berubah
function FitBoundsToRoute({ polyline, L }: { polyline: [number, number][] | null, L: any }) {
  const map = useMap();

  useEffect(() => {
    // Pastikan L sudah ter-load dan polyline ada
    if (L && polyline && polyline.length > 0) {
      // Buat bounding box dari koordinat polyline
      const bounds = L.latLngBounds(polyline);
      // Zoom map pas ke ukuran rute (sekali saja saat polyline berubah)
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [polyline, map, L]); // Dependency hanya polyline, jadi kalau bus gerak map DIAM.

  return null;
}

// ===== Bearing / Rotasi =====
const calculateBearing = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const toDeg = (rad: number) => (rad * 180) / Math.PI;

  const dLon = toRad(lon2 - lon1);
  const lat1Rad = toRad(lat1);
  const lat2Rad = toRad(lat2);

  const y = Math.sin(dLon) * Math.cos(lat2Rad);
  const x =
    Math.cos(lat1Rad) * Math.sin(lat2Rad) -
    Math.sin(lat1Rad) *
    Math.cos(lat2Rad) *
    Math.cos(dLon);

  let bearing = toDeg(Math.atan2(y, x));
  if (bearing < 0) bearing += 360;
  return bearing;
};

export default function MapView({
  buses,
  selectedRoute,
  onBusClick,
}: MapViewProps) {
  const [L, setL] = useState<any>(null);
  const [halteIcon, setHalteIcon] = useState<any>(null);
  const [decodedPolyline, setDecodedPolyline] = useState<
    [number, number][] | null
  >(null);

  const lastPositions = useRef<Map<number, { lat: number; lon: number }>>(
    new Map()
  );
  const rotations = useRef<Map<number, number>>(new Map());

  // ===== Init Leaflet =====
  useEffect(() => {
    import("leaflet").then((leaflet) => {
      setL(leaflet);

      setHalteIcon(
        leaflet.icon({
          iconUrl:
            "https://cdn-icons-png.flaticon.com/512/3448/3448339.png",
          iconSize: [30, 30],
          iconAnchor: [15, 30],
        })
      );
    });
  }, []);

  // ===== PARSE RUTE DARI BACKEND =====
  useEffect(() => {
    if (selectedRoute?.rute_polyline) {
      try {
        const parsed = JSON.parse(selectedRoute.rute_polyline);
        const coords: [number, number][] = parsed.map(
          (p: any) => [Number(p[0]), Number(p[1])]
        );
        setDecodedPolyline(coords);
      } catch (e) {
        console.error("❌ Gagal parse rute:", e);
        setDecodedPolyline(null);
      }
    } else {
      setDecodedPolyline(null);
    }
  }, [selectedRoute]);

  // ===== Hitung Rotasi Bus =====
  useEffect(() => {
    buses.forEach((bus) => {
      const lat = Number(bus.latitude);
      const lon = Number(bus.longitude);

      if (!isNaN(lat) && !isNaN(lon)) {
        const lastPos = lastPositions.current.get(bus.id_bus);

        if (lastPos && (lastPos.lat !== lat || lastPos.lon !== lon)) {
          const rot = calculateBearing(
            lastPos.lat,
            lastPos.lon,
            lat,
            lon
          );
          rotations.current.set(bus.id_bus, rot);
        } else if (!lastPos) {
          rotations.current.set(bus.id_bus, 0);
        }

        lastPositions.current.set(bus.id_bus, { lat, lon });
      }
    });
  }, [buses]);

  if (!L || !halteIcon) {
    return (
      <div className="flex h-full items-center justify-center">
        Memuat peta...
      </div>
    );
  }

  // ===== Bus Valid =====
  const activeBuses = buses.filter(
    (b) =>
      b.status === "berjalan" &&
      b.latitude &&
      b.longitude &&
      !isNaN(Number(b.latitude)) &&
      !isNaN(Number(b.longitude))
  );

  // Default Center (Kudus) - Tidak akan berubah-ubah mengikuti bus
  const defaultCenter: [number, number] = [-6.805, 110.84];

  return (
    <div className="h-full w-full rounded-xl overflow-hidden">
      <MapContainer
        center={defaultCenter}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {/* ✅ INI KUNCINYA: FitBoundsToRoute hanya akan trigger jika 'decodedPolyline' berubah */}
        {/* 'decodedPolyline' hanya berubah jika 'selectedRoute' berubah */}
        <FitBoundsToRoute polyline={decodedPolyline} L={L} />

        {decodedPolyline && (
          <Polyline
            positions={decodedPolyline}
            color="blue"
            weight={5}
            opacity={0.8}
          />
        )}

        {/* ===== HALTE ===== */}
        {selectedRoute?.halte?.map((h: any) => (
          <Marker
            key={h.id_halte}
            position={[
              Number(h.latitude),
              Number(h.longitude),
            ]}
            icon={halteIcon}
          >
            <Popup>
              <b>{h.nama_halte}</b>
            </Popup>
          </Marker>
        ))}

        {/* ===== BUS ===== */}
        {activeBuses.map((bus) => {
          const rotation = rotations.current.get(bus.id_bus) || 0;

          const busIcon = L.divIcon({
            className: "",
            html: `
        <img 
          src="/assets/icons/bus.png"
          style="
            width:40px;
            height:40px;
            transform: rotate(${rotation + 180}deg);
            transition: transform 0.5s;
          "
        />
      `,
            iconSize: [40, 40],
            iconAnchor: [20, 20],
          });

          return (
            <Marker
              key={bus.id_bus}
              position={[
                Number(bus.latitude),
                Number(bus.longitude),
              ]}
              icon={busIcon}
              eventHandlers={{
                click: () => onBusClick(bus),
              }}

            >
              <Popup>
                <b>{bus.kode_bus}</b>
                <br />
                Status: {bus.status}
                <br />
                Penumpang: {bus.penumpang}
              </Popup>
            </Marker>
          );
        })}

        {/* ❌ SAYA HAPUS <MapUpdater /> AGAR PETA TIDAK MENGIKUTI BUS */}
      </MapContainer>
    </div>
  );
}