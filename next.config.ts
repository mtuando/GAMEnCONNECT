import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.public.blob.vercel-storage.com',  // Will change to Cloudflare soon.
        pathname: '/**', 
      },
    ],
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Prevents client bundle from trying to process server-side api files
      config.module.rules.push({
        test: /src\/app\/api\/.*$/,
        use: 'null-loader',
      });

      // Enables polling for file changes in development mode
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      }
    }
    return config;
  },
};

export default nextConfig;
