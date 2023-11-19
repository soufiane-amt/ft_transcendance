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
    domains: ["localhost", "cdn.intra.42.fr"], // Add any other domains as needed
  },
};

const nextConfig = {
  images: {
    domains: [
      process.env.NEXT_PUBLIC_BACKEND_SERV,
      "cdn.intra.42.fr",
      process.env.NEXT_PUBLIC_DOMAIN,
    ],
  },
};
