import Image from "next/image";

export default function ProfileCard() {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-md flex flex-col items-center gap-3">
      <Image
        src="/assets/images/profile.png"
        alt="Profile"
        width={80}
        height={80}
        className="rounded-full"
      />
      <div className="text-center">
        <p className="font-semibold text-lg">Syifa Dwiky B.</p>
        <p className="text-sm text-gray">Driver</p>
      </div>
      <div className="text-center bg-softSuccess px-3 py-1 rounded-md text-success text-sm font-medium">
        Seat 34/40 Penumpang
      </div>
      <div className="space-y-2 w-full">
        <div className="bg-primary text-white rounded-lg p-3 text-center">Bus A</div>
        <div className="bg-blue-500/80 text-white rounded-lg p-3 text-center">Bus A</div>
        <div className="bg-blue-300 text-white rounded-lg p-3 text-center">Bus A</div>
      </div>
    </div>
  );
}
