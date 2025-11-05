/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'alisinai',
      'res.cloudinary.com',
      'example.com',
      'localhost',
      // Add other domains you use for images
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
}

module.exports = nextConfig