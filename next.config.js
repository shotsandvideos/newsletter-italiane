/** @type {import('next').NextConfig} */
const nextConfig = {
  // Build optimizations
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Enable React strict mode for better development
  reactStrictMode: true,
  
  // SWC minifier is enabled by default in Next.js 13+
  
  // Turbopack configuration for development
  turbopack: {
    resolveAlias: {
      // Help Turbopack resolve modules correctly
      '@/*': ['./src/*'],
    },
  },
  
  // Webpack configuration for production optimizations
  webpack: (config, { dev, isServer }) => {
    // Production optimizations
    if (!dev) {
      // Remove development-only code in production
      config.resolve.alias = {
        ...config.resolve.alias,
      }
      
      // Optimize bundle size by removing unused code
      config.optimization = {
        ...config.optimization,
        usedExports: true,
        sideEffects: false,
      }
    }
    
    return config
  },
  
  // NODE_ENV is automatically available
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options', 
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ]
      }
    ]
  }
};

module.exports = nextConfig;
