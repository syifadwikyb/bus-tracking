import Image from "next/image";

export default function Header() {
    return (
        <header className="flex items-center justify-between mb-6">
            <div>
                <h3 className="text-lg font-medium text-gray-600">Good Morning Admin!</h3>
                <h2 className="text-3xl font-bold text-gray-900">Management Drivers</h2>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 shadow-md">
                <Image src="/assets/icons/Profile.svg" alt="Admin Profile" width={40} height={40} className="rounded-full" />
            </div>
        </header>
    );
}