import Image from 'next/image';

export default function ProfileCard() {
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 shadow-md">
      <Image
        src="/assets/icons/Profile.svg"
        alt="Admin Profile"
        width={40}
        height={40}
        className="rounded-full"
      />
    </div>
  );
}