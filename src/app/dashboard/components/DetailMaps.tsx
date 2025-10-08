"use client";

export default function DetailMaps() {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-md">
      <div className="flex justify-between items-center mb-2">
        <select className="border border-gray-300 rounded-md px-3 py-1 text-sm">
          <option>Rute A</option>
          <option>Rute B</option>
        </select>
      </div>
      <div className="h-[350px] w-full bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray">[Map Placeholder]</p>
      </div>
    </div>
  );
}
