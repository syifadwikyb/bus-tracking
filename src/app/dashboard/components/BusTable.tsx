// src/components/dashboard/BusTable.tsx
const busData = [
  { number: "H 6235 HS", route: "1", driver: "Yanto Hari", capacity: "34/40", status: "Active" },
  { number: "H 6235 HS", route: "1", driver: "Yanto Hari", capacity: "34/40", status: "Maintenance" },
  { number: "H 6235 HS", route: "1", driver: "Yanto Hari", capacity: "34/40", status: "Active" },
  { number: "H 6235 HS", route: "1", driver: "Yanto Hari", capacity: "34/40", status: "Active" },
  { number: "H 6235 HS", route: "1", driver: "Yanto Hari", capacity: "34/40", status: "Active" },
];

export default function BusTable() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-success/10 text-success";
      case "Maintenance":
        return "bg-softWarning text-warning";
      case "Non-Active":
        return "bg-softDanger text-danger";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-gray-800 text-xl">Bus Overview</h3>
        <button className="px-4 py-2 bg-primary/10 text-primary rounded-xl font-semibold hover:bg-primary hover:text-white transition-colors">
          Export Data
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Bus Number</th>
              <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Route</th>
              <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Driver</th>
              <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Kapasitas</th>
              <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Status</th>
              <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {busData.map((bus, index) => (
              <tr
                key={index}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                    </div>
                    <span className="font-semibold text-gray-800">{bus.number}</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="px-3 py-1 bg-blue-50 text-primary rounded-lg font-medium text-sm">
                    Route {bus.route}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-gray-700">{bus.driver}</span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 w-20">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: "85%" }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-700">{bus.capacity}</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className={`px-3 py-1.5 rounded-xl font-semibold text-sm ${getStatusColor(bus.status)}`}>
                    {bus.status}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <button className="w-8 h-8 bg-gray-100 hover:bg-primary hover:text-white text-gray-600 rounded-lg transition-colors flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <p className="text-sm text-gray-600">Showing 1 to 5 of 50 entries</p>
        <div className="flex items-center gap-2">
          <button className="w-9 h-9 bg-gray-100 hover:bg-primary hover:text-white text-gray-600 rounded-lg transition-colors flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button className="w-9 h-9 bg-primary text-white rounded-lg font-semibold">1</button>
          <button className="w-9 h-9 bg-gray-100 hover:bg-primary hover:text-white text-gray-600 rounded-lg transition-colors font-semibold">2</button>
          <button className="w-9 h-9 bg-gray-100 hover:bg-primary hover:text-white text-gray-600 rounded-lg transition-colors font-semibold">3</button>
          <button className="w-9 h-9 bg-gray-100 hover:bg-primary hover:text-white text-gray-600 rounded-lg transition-colors flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}