import withPWA from 'next-pwa';

const nextConfig = {
  // your existing config
  allowedDevOrigins: ['172.20.10.10', 'localhost', '127.0.0.1'],
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '*' }],
  },
};

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
})(nextConfig);



