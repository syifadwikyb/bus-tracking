'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

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

function LocationMarker({ position, setPosition, readOnly }: any) {
    useMapEvents({
        click(e) {
            if (!readOnly && setPosition) {
                setPosition({ lat: e.latlng.lat, lng: e.latlng.lng });
            }
        },
    });

    return position ? <Marker position={position} icon={customIcon} /> : null;
}

function MapUpdater({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.flyTo(center, map.getZoom());
    }, [center, map]);
    return null;
}

interface BusStopProps {
    position: { lat: number; lng: number } | null;
    setPosition?: (pos: { lat: number; lng: number }) => void;
    readOnly?: boolean;
}

const BusStop = ({ position, setPosition, readOnly = false }: BusStopProps) => {
    const defaultCenter: [number, number] = [-6.966667, 110.416664];
    const mapCenter = position ? [position.lat, position.lng] : defaultCenter;

    return (
        <MapContainer
            center={mapCenter as L.LatLngExpression}
            zoom={15}
            className="w-full h-full rounded-xl z-0"
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
            />

            <LocationMarker position={position} setPosition={setPosition} readOnly={readOnly} />

            {position && <MapUpdater center={[position.lat, position.lng]} />}
        </MapContainer>
    );
};

export default BusStop;