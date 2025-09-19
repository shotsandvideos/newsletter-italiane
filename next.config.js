/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  turbopack: {
    resolveAlias: {
      // Help Turbopack resolve modules correctly
      '@/*': ['./src/*'],
    },
  },
};

module.exports = nextConfig;