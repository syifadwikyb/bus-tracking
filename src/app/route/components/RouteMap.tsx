'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix icon marker leaflet yang hilang di Next.js
const iconUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png';
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png';

const customIcon = L.icon({
    iconUrl: iconUrl,
    iconRetinaUrl: iconRetinaUrl,
    shadowUrl: shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

// Komponen untuk menangani klik di peta
function ClickHandler({ onMapClick, readOnly }: { onMapClick: (latlng: L.LatLng) => void, readOnly?: boolean }) {
    useMapEvents({
        click(e) {
            if (!readOnly) {
                onMapClick(e.latlng);
            }
        },
    });
    return null;
}

interface RouteMapProps {
    points: [number, number][]; // Array koordinat [lat, lng]
    setPoints?: (points: [number, number][]) => void; // Fungsi update state (opsional utk readOnly)
    readOnly?: boolean;
}

const RouteMap = ({ points, setPoints, readOnly = false }: RouteMapProps) => {
    // Pusat peta default (Misal: Semarang/Indonesia)
    const defaultCenter: [number, number] = [-6.966667, 110.416664];

    const handleMapClick = (latlng: L.LatLng) => {
        if (setPoints) {
            const newPoint: [number, number] = [latlng.lat, latlng.lng];
            setPoints([...points, newPoint]);
        }
    };

    return (
        <MapContainer
            center={points.length > 0 ? points[0] : defaultCenter}
            zoom={13}
            className="w-full h-full rounded-xl z-0"
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
            />

            {/* Logic Klik */}
            <ClickHandler onMapClick={handleMapClick} readOnly={readOnly} />

            {/* Gambar Garis Rute */}
            {points.length > 1 && (
                <Polyline positions={points} color="blue" weight={5} opacity={0.7} />
            )}

            {/* Gambar Marker (Titik) */}
            {points.map((pos, idx) => (
                <Marker key={idx} position={pos} icon={customIcon} />
            ))}
        </MapContainer>
    );
};

export default RouteMap;