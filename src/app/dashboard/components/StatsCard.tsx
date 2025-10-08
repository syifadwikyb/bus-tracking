import Image from "next/image";

interface StatsCardProps {
  title: string;
  count: number;
  label: string;
  icon: string; // bisa kirim path bebas, misal "/icons/bus.svg"
  gradient: string;
}

export default function StatsCard({
  title,
  count,
  label,
  icon,
  gradient,
}: StatsCardProps) {
  return (
    <div
      className={`relative bg-gradient-to-br ${gradient} rounded-2xl p-6 shadow-xl overflow-hidden group hover:scale-105 transition-transform duration-300`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-white rounded-full" />
        <div className="absolute -left-8 -bottom-8 w-24 h-24 bg-white rounded-full" />
      </div>

      <div className="relative z-10 flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            {/* ✅ Icon pakai file dari assets/public */}
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Image
                src={icon}
                alt={title}
                width={28}
                height={28}
                className="invert brightness-200"
              />
            </div>
            <span className="text-white font-semibold text-lg">{title}</span>
          </div>

          <div className="flex items-end gap-2">
            <span className="text-5xl font-bold text-white">{count}</span>
            <span className="text-2xl font-semibold text-white/90 mb-1">
              {label}
            </span>
          </div>
        </div>

        {/* Decorative Arrow */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
