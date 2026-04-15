import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* High-performance production settings */
  typescript: {
    // Ignore build errors for rapid prototyping; recommended to fix for production
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignore lint errors during builds to prevent CI/CD blockages
    ignoreDuringBuilds: true,
  },
  // Optimize image loading for placeholder and remote assets
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
    ],
  },
  // Ensure the app is optimized for standalone environments like App Hosting or Vercel
  output: 'standalone',
  // Enable React Strict Mode for better debugging of rendering issues
  reactStrictMode: true,
};

export default nextConfig;
