"use client";

import Image from "next/image";
import { useState } from "react";

const menu = [
  { name: "Dashboard", icon: "/assets/icons/Dashboard.svg", route: "/dashboard" },
  { name: "Bus", icon: "/assets/icons/Bus.svg", route: "/bus" },
  { name: "Bus Stop", icon: "/assets/icons/Bus-Stop.svg", route: "/bus-stop" },
  { name: "Route", icon: "/assets/icons/Route.svg", route: "/route" },
  { name: "Drivers", icon: "/assets/icons/Driver.svg", route: "/drivers" },
  { name: "Maintenance", icon: "/assets/icons/Maintenance.svg", route: "/maintenance" },
];

export default function Sidebar() {
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  return (
    <aside className="w-72 bg-blue-800 shadow-2xl flex flex-col justify-between p-6 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-5 rounded-full -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-5 rounded-full -ml-16 -mb-16" />
      
      <div className="relative z-10">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3 mb-12 pb-6 border-b border-white/20">
          <div className="w-12 h-12 bg-gradient-to-br from-white to-blue-100 rounded-xl flex items-center justify-center shadow-lg">
            <div className="w-6 h-6 bg-primary rounded-md" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">BusTrack</h1>
            <p className="text-xs text-blue-200">Management System</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex flex-col gap-2">
          {menu.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveMenu(item.name)}
              className={`
                group flex items-center gap-4 px-4 py-3.5 rounded-xl text-left transition-all duration-300 relative
                ${
                  activeMenu === item.name
                    ? "bg-white text-primary shadow-lg scale-105"
                    : "text-white hover:bg-white/10 hover:translate-x-1"
                }
              `}
            >
              {/* Active Indicator */}
              {activeMenu === item.name && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-primary rounded-r-full" />
              )}
              
              {/* Icon */}
              <div
                className={`
                  w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300
                  ${
                    activeMenu === item.name
                      ? "bg-primary/10"
                      : "bg-white/10 group-hover:bg-white/20"
                  }
                `}
              >
                <Image
                  src={item.icon}
                  alt={item.name}
                  width={20}
                  height={20}
                  className={`${activeMenu === item.name ? "brightness-0" : "brightness-0 invert"}`}
                />
              </div>
              
              {/* Text */}
              <span className={`font-semibold ${activeMenu === item.name ? "text-primary" : "text-white"}`}>
                {item.name}
              </span>

              {/* Arrow Indicator */}
              {activeMenu === item.name && (
                <svg
                  className="ml-auto w-5 h-5 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col gap-3 relative z-10">
        <button className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-white bg-white/10 hover:bg-white/20 transition-all duration-300 hover:translate-x-1 group">
          <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-all">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <span className="font-semibold">Settings</span>
        </button>

        <button className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-white bg-danger hover:bg-danger/90 transition-all duration-300 hover:translate-x-1 shadow-lg group">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-all">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </div>
          <span className="font-semibold">Logout</span>
        </button>
      </div>
    </aside>
  );
}