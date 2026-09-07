import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: [
    '@autohub360/ui',
    '@autohub360/config',
    '@autohub360/catalog',
    '@autohub360/commerce',
    '@autohub360/vehicle-fitment',
    '@autohub360/auth',
    '@autohub360/analytics',
    '@autohub360/integrations',
  ],
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

export default nextConfig;
