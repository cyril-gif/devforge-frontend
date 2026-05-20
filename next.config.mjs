/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow iPhone access in development
  allowedDevOrigins: ['172.20.10.10', 'localhost', '127.0.0.1'],
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;