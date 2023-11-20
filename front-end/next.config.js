/** @type {import('next').NextConfig} */

// next.config.js
module.exports = {
  // Other Next.js configuration options...
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },

  // Enable TypeScript checking
  typescript: {
    // Optionally specify the type-checker version
    ignoreBuildErrors: true, // Set to true to disable type-checking during production build
  },

  images: {
    remotePatterns: [
      {
        protocol: 'http',
        port: '3001',
        hostname: process.env.NEXT_PUBLIC_DOMAIN,
        pathname: '**',
      },
      {
        protocol: 'https',
        port: '443',
        hostname: process.env.INTRA_DOMAIN,
        pathname: '**',
      }
    ],
  },
};

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        port: '3001',
        hostname: process.env.NEXT_PUBLIC_DOMAIN,
        pathname: '**',
      },
      {
        protocol: 'https',
        port: '443',
        hostname: process.env.INTRA_DOMAIN,
        pathname: '**',
      }
    ],
  },
};
