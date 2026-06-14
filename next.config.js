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

  // ----------------------------------------------------------------
  // Webpack polyfills required by @solana/web3.js + wallet adapters
  // These Node.js built-ins don't exist in browser/Vercel edge runtime
  // Must be polyfilled for the wallet modal to work correctly.
  // ----------------------------------------------------------------
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        os: false,
        path: false,
        crypto: false,
        stream: false,
        http: false,
        https: false,
        zlib: false,
        net: false,
        tls: false,
        dns: false,
        child_process: false,
      };
    }
    return config;
  },

  // Silence warnings from wallet adapter packages on build
  experimental: {
    esmExternals: 'loose',
  },
};

module.exports = nextConfig;
