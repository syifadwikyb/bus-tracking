"use client";

import React, { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import polyline from "@mapbox/polyline";
import "leaflet/dist/leaflet.css";
import { useMap } from "react-leaflet";
import type { Bus } from "../DashboardClient"; // tipe Bus

// Dynamic import komponen Leaflet
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

// Komponen bantu untuk memperbarui posisi peta
function MapUpdater({ center }: { center: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.panTo(center, { animate: true });
  }, [center, map]);
  return null;
}

// Fungsi menghitung rotasi arah bus
const calculateBearing = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const toDeg = (rad: number) => (rad * 180) / Math.PI;
  const dLon = toRad(lon2 - lon1);
  const lat1Rad = toRad(lat1);
  const lat2Rad = toRad(lat2);
  const y = Math.sin(dLon) * Math.cos(lat2Rad);
  const x =
    Math.cos(lat1Rad) * Math.sin(lat2Rad) -
    Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);
  let bearing = toDeg(Math.atan2(y, x));
  if (bearing < 0) bearing += 360;
  return bearing;
};

// --- KOMPONEN UTAMA ---
export default function MapView({ buses, selectedRoute, onBusClick }: MapViewProps) {
  const [L, setL] = useState<any>(null);
  const [halteIcon, setHalteIcon] = useState<any>(null);
  const [busIcon, setBusIcon] = useState<any>(null);
  const [decodedPolyline, setDecodedPolyline] = useState<[number, number][] | null>(null);

  const lastPositions = useRef<Map<number, { lat: number, lon: number }>>(new Map());
  const rotations = useRef<Map<number, number>>(new Map());

  // Import leaflet dan set ikon
  useEffect(() => {
    import("leaflet").then((leaflet) => {
      setL(leaflet);
      // Ikon halte
      setHalteIcon(
        leaflet.icon({
          iconUrl: "/assets/icons/Bus-Stop.svg",
          iconSize: [35, 35],
          iconAnchor: [17, 35],
        })
      );

      // Ikon bus
      setBusIcon(
        leaflet.icon({
          iconUrl: "/assets/icons/bus.png",
          iconSize: [40, 40],
          iconAnchor: [20, 20],
        })
      );
    });
  }, []);

  // Decode polyline jika rute dipilih
  useEffect(() => {
    if (selectedRoute && selectedRoute.rute_polyline) {
      try {
        const decoded = polyline.decode(selectedRoute.rute_polyline);
        setDecodedPolyline(decoded as [number, number][]);
      } catch (e) {
        console.error("Gagal decode polyline:", e);
        setDecodedPolyline(null);
      }
    } else {
      setDecodedPolyline(null);
    }
  }, [selectedRoute]);

  // Hitung rotasi bus
  useEffect(() => {
    buses.forEach(bus => {
      if (bus.latitude && bus.longitude) {
        const lastPos = lastPositions.current.get(bus.id_bus);
        if (lastPos && (lastPos.lat !== bus.latitude || lastPos.lon !== bus.longitude)) {
          const newRotation = calculateBearing(
            lastPos.lat,
            lastPos.lon,
            bus.latitude,
            bus.longitude
          );
          rotations.current.set(bus.id_bus, newRotation);
        } else if (!lastPos) {
          rotations.current.set(bus.id_bus, 0);
        }
        lastPositions.current.set(bus.id_bus, { lat: bus.latitude, lon: bus.longitude });
      }
    });
  }, [buses]);

  if (!L || !halteIcon || !busIcon) {
    return (
      <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p>Memuat peta...</p>
      </div>
    );
  }

  const activeBuses = buses.filter(b => b.latitude && b.longitude);
  const mapCenter: [number, number] = activeBuses.length > 0
    ? [activeBuses[0].latitude!, activeBuses[0].longitude!]
    : [-6.9175, 107.6191]; // Default Bandung

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <MapContainer center={mapCenter} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' />
        {/* Polyline Rute */}
        {decodedPolyline && <Polyline positions={decodedPolyline} color="blue" />}

        {/* Marker Halte */}
        {selectedRoute && selectedRoute.halte &&
          selectedRoute.halte.map((halte: any) => (
            <Marker
              key={halte.id_halte}
              position={[halte.latitude, halte.longitude]}
              icon={halteIcon}
            >
              <Popup>
                <b>Halte {halte.urutan}</b><br />
                {halte.nama_halte}
              </Popup>
            </Marker>
          ))}

        {/* Marker Bus */}
        {buses.map(bus => {
          if (bus.latitude && bus.longitude) {
            const rotation = rotations.current.get(bus.id_bus) || 0;

            // Menggunakan divIcon agar bisa rotasi
            const dynamicBusIcon = L.divIcon({
              className: "custom-bus-icon",
              html: `<img src="/assets/icons/bus.png" style="width: 100%; height: 100%; transform: rotate(${rotation}deg);" />`,
              iconSize: [40, 40],
              iconAnchor: [20, 20],
            });

            return (
              <Marker
                key={bus.id_bus}
                position={[bus.latitude, bus.longitude]}
                icon={dynamicBusIcon}
                eventHandlers={{
                  click: () => onBusClick(bus),
                }}
              >
                <Popup>
                  <b>{bus.kode_bus || bus.plat_nomor}</b> <br />
                  Supir: {bus.nama || "N/A"} <br />
                  Penumpang: {bus.penumpang} / {bus.kapasitas}
                </Popup>
              </Marker>
            );
          }
          return null;
        })}

        {/* Pusatkan peta */}
        <MapUpdater center={mapCenter} />
      </MapContainer>
    </div>
  );
}