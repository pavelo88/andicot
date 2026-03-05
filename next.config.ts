import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      },
      // Logos de marcas permitidos
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      { protocol: 'https', hostname: 'www.pelco.com' },
      { protocol: 'https', hostname: 'www.motorolasolutions.com' },
      { protocol: 'https', hostname: 'www.lenels2.com' },
      { protocol: 'https', hostname: 'www.edwardsfiresafety.com' },
      { protocol: 'https', hostname: 'www.security.honeywell.com' },
      { protocol: 'https', hostname: 'www.cisco.com' },
      { protocol: 'https', hostname: 'www.honeywell.com' },
      { protocol: 'https', hostname: 'www.dsc.com' },
      { protocol: 'https', hostname: 'download.schneider-electric.com' },
    ],
  },
};

export default nextConfig;
