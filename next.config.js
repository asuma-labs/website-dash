/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.asuma.my.id',
        pathname: '/**',
      },
      
      {
        protocol: 'https',
        hostname: 'bot.asuma.my.id',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
