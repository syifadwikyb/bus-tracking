// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000', // Pastikan port-nya benar
        pathname: '/**', // Izinkan semua path di host tersebut
      },
    ],
  },
};

module.exports = nextConfig;