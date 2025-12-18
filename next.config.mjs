/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Enable standalone mode for Docker deployment
  output: 'standalone',
  // Add empty turbopack config to silence Turbopack warnings
  turbopack: {},
  webpack: (config) => {
    config.resolve.alias['@'] = require('path').resolve(__dirname);
    return config;
  },
}

export default nextConfig