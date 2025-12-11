"use client";

import React, { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import polyline from "@mapbox/polyline"; // Pastikan sudah: npm install @mapbox/polyline
import "leaflet/dist/leaflet.css";
import { useMap } from "react-leaflet";
import type { Bus } from "../DashboardClient";

// Import Leaflet Dinamis (Wajib untuk Next.js)
const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(mod => mod.Popup), { ssr: false });
const Polyline = dynamic(() => import("react-leaflet").then(mod => mod.Polyline), { ssr: false });

interface MapViewProps {
  buses: Bus[];
  selectedRoute: any;
  onBusClick: (bus: Bus | null) => void;
}

// Komponen Update Peta Smooth
function MapUpdater({ center }: { center: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, 14); // flyTo lebih smooth daripada panTo
  }, [center, map]);
  return null;
}

// Fungsi Rotasi (Bearing)
const calculateBearing = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const toDeg = (rad: number) => (rad * 180) / Math.PI;
  const dLon = toRad(lon2 - lon1);
  const lat1Rad = toRad(lat1);
  const lat2Rad = toRad(lat2);
  const y = Math.sin(dLon) * Math.cos(lat2Rad);
  const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) -
    Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);
  let bearing = toDeg(Math.atan2(y, x));
  if (bearing < 0) bearing += 360;
  return bearing;
};

export default function MapView({ buses, selectedRoute, onBusClick }: MapViewProps) {
  const [L, setL] = useState<any>(null);
  const [halteIcon, setHalteIcon] = useState<any>(null);
  const [decodedPolyline, setDecodedPolyline] = useState<[number, number][] | null>(null);

  const lastPositions = useRef<Map<number, { lat: number, lon: number }>>(new Map());
  const rotations = useRef<Map<number, number>>(new Map());

  // Init Leaflet & Icons
  useEffect(() => {
    import("leaflet").then((leaflet) => {
      setL(leaflet);

      // Menggunakan link online untuk tes (bisa diganti path lokal nanti)
      // Tujuannya memastikan icon muncul dulu meskipun path lokal salah
      setHalteIcon(
        leaflet.icon({
          iconUrl: "https://cdn-icons-png.flaticon.com/512/3448/3448339.png",
          iconSize: [30, 30],
          iconAnchor: [15, 30],
        })
      );
    });
  }, []);

  // Decode Rute & Debugging
  useEffect(() => {
    if (selectedRoute) {
      console.log("📍 [DEBUG] Data Rute Diterima:", selectedRoute);

      // Cek variasi nama field polyline (rute_polyline vs polyline)
      const polyString = selectedRoute.rute_polyline || selectedRoute.polyline;

      if (polyString && typeof polyString === 'string') {
        try {
          const decoded = polyline.decode(polyString);
          console.log("✅ Polyline decoded:", decoded.length, "points");
          setDecodedPolyline(decoded as [number, number][]);
        } catch (e) {
          console.error("❌ Gagal decode polyline:", e);
          setDecodedPolyline(null);
        }
      } else {
        console.warn("⚠️ Polyline string kosong/null pada data rute.");
        setDecodedPolyline(null);
      }
    } else {
      setDecodedPolyline(null);
    }
  }, [selectedRoute]);

  // Hitung Rotasi Bus
  useEffect(() => {
    buses.forEach(bus => {
      // KONVERSI KE NUMBER (PENTING! Agar matematika tidak error NaN)
      const lat = Number(bus.latitude);
      const lon = Number(bus.longitude);

      if (!isNaN(lat) && !isNaN(lon)) {
        const lastPos = lastPositions.current.get(bus.id_bus);

        if (lastPos && (lastPos.lat !== lat || lastPos.lon !== lon)) {
          const newRotation = calculateBearing(lastPos.lat, lastPos.lon, lat, lon);
          rotations.current.set(bus.id_bus, newRotation);
        } else if (!lastPos) {
          rotations.current.set(bus.id_bus, 0);
        }

        lastPositions.current.set(bus.id_bus, { lat, lon });
      }
    });
  }, [buses]);

  if (!L || !halteIcon) {
    return <div className="flex h-full items-center justify-center p-10">Memuat Peta...</div>;
  }

  // Filter Bus Valid (Hanya yang punya koordinat angka valid)
  const activeBuses = buses.filter(b =>
    b.latitude && b.longitude &&
    !isNaN(Number(b.latitude)) && !isNaN(Number(b.longitude))
  );

  const mapCenter: [number, number] = activeBuses.length > 0
    ? [Number(activeBuses[0].latitude), Number(activeBuses[0].longitude)]
    : [-6.805, 110.84]; // Default Kudus

  return (
    <div style={{ height: "100%", width: "100%", borderRadius: "12px", overflow: "hidden" }}>
      <MapContainer center={mapCenter} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />

        {/* 1. POLYLINE RUTE */}
        {decodedPolyline && <Polyline positions={decodedPolyline} color="blue" weight={5} opacity={0.7} />}

        {/* 2. MARKER HALTE */}
        {selectedRoute && selectedRoute.halte && Array.isArray(selectedRoute.halte) &&
          selectedRoute.halte.map((halte: any) => (
            <Marker
              key={halte.id_halte}
              position={[Number(halte.latitude), Number(halte.longitude)]}
              icon={halteIcon}
            >
              <Popup>
                <b>Halte: {halte.nama_halte}</b>
              </Popup>
            </Marker>
          ))}

        {/* 3. MARKER BUS */}
        {activeBuses.map(bus => {
          const lat = Number(bus.latitude);
          const lon = Number(bus.longitude);
          const rotation = rotations.current.get(bus.id_bus) || 0;

          // Custom Icon dengan Rotasi (HTML divIcon)
          const dynamicBusIcon = L.divIcon({
            className: "custom-bus-icon",
            // Pastikan path image benar. Tambahkan onerror untuk fallback.
            html: `<img src="/assets/icons/bus.png" 
                   style="width: 100%; height: 100%; transform: rotate(${rotation}deg); transition: transform 0.5s;" 
                   onerror="this.src='https://cdn-icons-png.flaticon.com/512/3448/3448339.png'"/>`,
            iconSize: [40, 40],
            iconAnchor: [20, 20],
          });

          return (
            <Marker
              key={bus.id_bus}
              position={[lat, lon]}
              icon={dynamicBusIcon}
              eventHandlers={{ click: () => onBusClick(bus) }}
            >
              <Popup>
                <div className="font-sans">
                  <b className="block text-sm mb-1">{bus.kode_bus || bus.plat_nomor}</b>
                  <p className="text-xs m-0">Status: {bus.status}</p>
                  <p className="text-xs m-0">Penumpang: {bus.penumpang}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}

        <MapUpdater center={activeBuses.length > 0 ? mapCenter : null} />
      </MapContainer>
    </div>
  );
}