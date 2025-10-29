import Image from 'next/image';

interface DriverInfoProps {
  bus: any;
}

export default function DriverInfo({ bus }: DriverInfoProps) {
  const nama = bus?.nama || 'N/A';
  const penumpang = bus?.penumpang ?? 0;
  const kapasitas = bus?.kapasitas ?? 40;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-4">
      <Image
        src="/assets/icons/Profile.svg"
        alt="Driver Avatar"
        width={56}
        height={56}
        className="rounded-full object-cover"
      />
      <div className="flex-1">
        <p className="text-sm text-gray-500">Driver</p>
        <p className="text-lg font-semibold text-gray-800">{nama}</p>
      </div>
      <div className="text-right">
        <p className="text-sm text-gray-500">Penumpang</p>
        <p className="text-lg font-semibold text-gray-800">{penumpang}/{kapasitas}</p>
      </div>
    </div>
  );
}