/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
      domains: [process.env.NEXT_PUBLIC_BACKEND_SERV, 'cdn.intra.42.fr'],
  },
}

module.exports = nextConfig
