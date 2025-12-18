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
  // Configure base path for proper routing
  basePath: '',
}

export default nextConfig