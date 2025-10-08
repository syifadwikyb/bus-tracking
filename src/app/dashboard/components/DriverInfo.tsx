// src/components/dashboard/DriverInfo.tsx
export default function DriverInfo() {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-800 text-lg">Active Driver</h3>
        <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
      </div>

      <div className="flex items-center gap-4">
        {/* Driver Avatar */}
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-400 rounded-2xl flex items-center justify-center shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-success rounded-full border-2 border-white" />
        </div>

        {/* Driver Info */}
        <div className="flex-1">
          <h4 className="font-bold text-gray-800 mb-1">Syifa Dwiky B.</h4>
          <p className="text-sm text-gray-500 mb-2">Driver</p>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-3 py-1 bg-blue-50 rounded-lg">
              <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-xs font-semibold text-primary">56/40 Penumpang</span>
            </div>
          </div>
        </div>

        {/* Call Button */}
        <button className="w-10 h-10 bg-success/10 hover:bg-success hover:text-white text-success rounded-xl flex items-center justify-center transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </button>
      </div>
    </div>
  );
}