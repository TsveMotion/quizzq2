/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {},
  serverExternalPackages: ['bcrypt'],
  webpack: (config) => {
    config.externals = [...config.externals, 'bcrypt'];
    return config;
  }
}

module.exports = nextConfig;
