import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  output: 'export', // Required for GitHub Pages
  basePath: process.env.BASE_PATH,
  assetPrefix: process.env.BASE_PATH,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true, // Required for static export
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
