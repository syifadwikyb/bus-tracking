import Image from 'next/image';

interface DriverInfoProps {
  bus: {
    nama?: string;
    foto?: string;
    penumpang?: number;
    kapasitas?: number;
  [key: string]: any;
  } | null;
}

export default function DriverInfo({ bus }: DriverInfoProps) {
  // --- 1. PERBAIKAN NAMA DRIVER ---
  // Masalah Anda sebelumnya: bus?.nama. Kemungkinan besar di objek bus tidak ada key 'nama'.
  // Cek console browser Anda untuk melihat struktur objek 'bus' yang sebenarnya.
  // Di sini saya berasumsi backend mengirimnya sebagai 'driver_name'.
  // GANTI 'driver_name' DI BAWAH INI SESUAI DATA BACKEND ANDA YANG BENAR.
  const nama = bus?.driver_name || bus?.nama || 'Supir Tidak Diketahui';

  const penumpang = bus?.penumpang ?? 0;
  const kapasitas = bus?.kapasitas ?? 40;

  // --- 2. PERBAIKAN FOTO PROFIL DINAMIS ---
  const defaultProfileImg = "/assets/icons/Profile.svg";
  
  // State untuk menangani sumber gambar
  // Awalnya kita coba pakai foto dari data bus (misal: driver_photo)
  // ⚠️ Sesuaikan 'driver_photo' dengan nama field dari backend Anda.
  const [imgSrc, setImgSrc] = useState(bus?.driver_photo || defaultProfileImg);

  // Effect ini memastikan jika props bus berubah, kita reset coba pakai fotonya lagi
  useEffect(() => {
      // Jika ada data foto dan stringnya tidak kosong, coba pakai itu
      if (bus?.driver_photo && typeof bus.driver_photo === 'string' && bus.driver_photo.trim() !== '') {
          setImgSrc(bus.driver_photo);
      } else {
          // Jika tidak ada data foto, langsung pakai default
          setImgSrc(defaultProfileImg);
      }
  }, [bus]);


  const handleImageError = () => {
      // Jika gambar gagal dimuat (link rusak/404), fallback ke default
      if (imgSrc !== defaultProfileImg) {
          setImgSrc(defaultProfileImg);
      }
  };


  if (!bus) {
      return <div className="bg-white rounded-lg shadow-md p-4 animate-pulse">Memuat info driver...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-4">
      {/* Wrapper untuk avatar agar bentuknya konsisten */}
      <div className="relative h-14 w-14 flex-shrink-0 rounded-full overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center">
        <Image
          src={imgSrc}
          alt={`Foto ${nama}`}
          width={56}
          height={56}
          // Gunakan object-cover agar gambar mengisi lingkaran tanpa gepeng
          className="object-cover w-full h-full" 
          // Priority penting untuk LCP jika ini di atas lipatan layar
          priority={false} 
          // Fungsi ini jalan jika URL gambar rusak/404
          onError={handleImageError}
        />
      </div>
      
      <div className="flex-1 min-w-0"> {/* min-w-0 penting untuk truncate teks */}
        <p className="text-sm text-gray-500">Driver</p>
        <p className="text-lg font-semibold text-gray-800 truncate" title={nama}>
          {nama}
        </p>
      </div>
      
      <div className="text-right flex-shrink-0">
        <p className="text-sm text-gray-500">Penumpang</p>
        <p className="text-lg font-semibold text-gray-800">
          <span className={penumpang > kapasitas ? "text-red-600" : ""}>
            {penumpang}
          </span>
          <span className="text-gray-400">/{kapasitas}</span>
        </p>
      </div>
    </div>
  );
}