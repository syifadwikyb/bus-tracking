/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      // ✅ LOCAL
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/**",
      },
      // ✅ PRODUCTION (RENDER)
      {
        protocol: "https",
        hostname: "backend-bustracking.onrender.com",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;