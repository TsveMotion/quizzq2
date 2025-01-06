/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000']
    }
  },
  webpack: (config) => {
    config.externals = [...config.externals, 'bcrypt'];
    return config;
  }
}

module.exports = nextConfig;
