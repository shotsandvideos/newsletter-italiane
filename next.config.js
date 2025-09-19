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
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com https://apis.google.com https://www.googleapis.com;
              style-src 'self' 'unsafe-inline' https://accounts.google.com https://fonts.googleapis.com;
              font-src 'self' https://fonts.gstatic.com;
              img-src 'self' data: https: blob:;
              connect-src 'self' https://*.supabase.co https://accounts.google.com https://oauth2.googleapis.com https://www.googleapis.com;
              frame-src 'self' https://accounts.google.com;
              object-src 'none';
              base-uri 'self';
              form-action 'self';
            `.replace(/\s+/g, ' ').trim()
          }
        ]
      }
    ]
  }
};

module.exports = nextConfig;