/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'api.dicebear.com' },
      { protocol: 'https', hostname: '*.vercel.app' },
    ],
  },
  // Do NOT externalize mongodb — it must bundle normally
};

module.exports = nextConfig;
