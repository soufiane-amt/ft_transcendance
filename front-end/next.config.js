/** @type {import('next').NextConfig} */
const nextConfig = {}

// next.config.js
module.exports = {
    // Other Next.js configuration options...
    webpack(config) {
      config.module.rules.push({
        test: /\.svg$/,
        use: ["@svgr/webpack"]
      });
  
      return config;
    },
  
    // Enable TypeScript checking
    typescript: {
      // Optionally specify the type-checker version
      ignoreBuildErrors: false, // Set to true to disable type-checking during production build
    },

    images: {
      domains: ['localhost'], // Add any other domains as needed
    },
  
  };
  