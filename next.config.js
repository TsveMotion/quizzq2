/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb'
    }
  },
  serverExternalPackages: ['@prisma/client', 'bcrypt'],
  reactStrictMode: true
}

module.exports = nextConfig
