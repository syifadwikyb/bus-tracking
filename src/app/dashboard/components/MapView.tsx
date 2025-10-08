// src/components/dashboard/MapView.tsx
"use client";

import { useState } from "react";

export default function MapView() {
    const [selectedRoute, setSelectedRoute] = useState("Route A");
    const routes = ["Route A", "Route B", "Route C", "Route D"];

    return (
        <div className="bg-white rounded-3xl shadow-lg p-6 h-full">
            {/* Header with Route Selector */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                    </div>
                    <select
                        value={selectedRoute}
                        onChange={(e) => setSelectedRoute(e.target.value)}
                        className="px-4 py-2 bg-primary text-white rounded-xl font-semibold cursor-pointer hover:bg-primary/90 transition-colors outline-none"
                    >
                        {routes.map((route) => (
                            <option key={route} value={route}>
                                {route}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-2 px-4 py-2 bg-success/10 text-success rounded-xl">
                    <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                    <span className="font-semibold text-sm">Bus A</span>
                </div>
            </div>

            {/* Map Container */}
            <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl overflow-hidden h-96">
                {/* Mock Map with Grid Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="grid grid-cols-8 grid-rows-8 h-full">
                        {Array.from({ length: 64 }).map((_, i) => (
                            <div key={i} className="border border-gray-300" />
                        ))}
                    </div>
                </div>

                {/* Map Content - Placeholder for actual map integration */}
                <div className="relative h-full flex items-center justify-center">
                    {/* Route Path Visualization */}
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300">
                        <path
                            d="M 50 150 Q 150 50, 250 150 T 350 150"
                            stroke="#2356CF"
                            strokeWidth="3"
                            fill="none"
                            strokeDasharray="8 4"
                            className="animate-pulse"
                        />

                        {/* Bus Position */}
                        <circle cx="180" cy="100" r="8" fill="#0B7E6E" className="animate-pulse">
                            <animateTransform
                                attributeName="transform"
                                type="translate"
                                values="0,0; 20,10; 0,0"
                                dur="3s"
                                repeatCount="indefinite"
                            />
                        </circle>
                    </svg>

                    {/* Info Card */}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg">
                        <p className="text-xs text-gray-500 mb-1">Current Location</p>
                        <p className="font-semibold text-sm text-gray-800">Jl. Rembangan Center</p>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="w-6 h-6 bg-success/20 rounded-full flex items-center justify-center">
                                <svg className="w-3 h-3 text-success" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <span className="text-xs text-success font-medium">On Time</span>
                        </div>
                    </div>                    
                </div>
            </div>            
        </div>
    );
}