import React from 'react';

type StatsCardProps = {
  title: string;
  count: number;
  icon: React.ReactNode;
  color: string;
};

export default function StatsCard({ title, count, icon, color }: StatsCardProps) {
  return (
    <div className={`p-6 rounded-lg shadow-lg ${color} text-white`}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium uppercase opacity-80">{title}</p>
        <div className="opacity-90">{icon}</div>
      </div>
      <p className="text-3xl font-bold">{count}</p>
      <p className="text-sm font-medium">Bus</p>
    </div>
  );
}