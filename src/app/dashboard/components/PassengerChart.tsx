// src/components/dashboard/PassengerChart.tsx
"use client";

const chartData = [
  { month: "Nov 2018", online: 15, offline: 12 },
  { month: "Dec 2018", online: 10, offline: 18 },
  { month: "Jan 2019", online: 18, offline: 14 },
  { month: "Feb 2019", online: 22, offline: 16 },
  { month: "Mar 2019", online: 12, offline: 10 },
];

export default function PassengerChart() {
  const maxValue = 25;

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 h-full">
      <div className="mb-6">
        <h3 className="font-bold text-gray-800 text-lg mb-2">Passenger Statistics</h3>
        <p className="text-sm text-gray-500">Values Over Time, by Figure Type</p>
      </div>

      {/* Chart */}
      <div className="relative h-64 mb-6">
        <div className="absolute inset-0 flex items-end justify-between gap-3 px-2">
          {chartData.map((data, index) => {
            const onlineHeight = (data.online / maxValue) * 100;
            const offlineHeight = (data.offline / maxValue) * 100;

            return (
              <div key={index} className="flex-1 flex items-end justify-center gap-1.5">
                {/* Online Bar */}
                <div className="relative flex-1 group cursor-pointer">
                  <div
                    className="bg-gradient-to-t from-danger to-danger/80 rounded-t-lg transition-all duration-300 hover:from-danger/90 hover:to-danger/70"
                    style={{ height: `${onlineHeight}%` }}
                  >
                    {/* Tooltip */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-danger text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {data.online}
                    </div>
                  </div>
                </div>

                {/* Offline Bar */}
                <div className="relative flex-1 group cursor-pointer">
                  <div
                    className="bg-gradient-to-t from-primary to-primary/80 rounded-t-lg transition-all duration-300 hover:from-primary/90 hover:to-primary/70"
                    style={{ height: `${offlineHeight}%` }}
                  >
                    {/* Tooltip */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {data.offline}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* X-Axis Labels */}
      <div className="flex items-center justify-between px-2 mb-6">
        {chartData.map((data, index) => (
          <div key={index} className="flex-1 text-center">
            <p className="text-xs text-gray-500 font-medium">{data.month}</p>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gradient-to-br from-danger to-danger/80 rounded" />
          <span className="text-sm text-gray-600 font-medium">Online</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gradient-to-br from-primary to-primary/80 rounded" />
          <span className="text-sm text-gray-600 font-medium">Offline</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 mt-6">
        <div className="bg-gradient-to-br from-danger/10 to-danger/5 rounded-2xl p-4">
          <p className="text-sm text-gray-600 mb-1">Total Online</p>
          <p className="text-2xl font-bold text-danger">77</p>
          <p className="text-xs text-danger/70 mt-1">+12% from last month</p>
        </div>
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-4">
          <p className="text-sm text-gray-600 mb-1">Total Offline</p>
          <p className="text-2xl font-bold text-primary">70</p>
          <p className="text-xs text-primary/70 mt-1">-5% from last month</p>
        </div>
      </div>
    </div>
  );
}