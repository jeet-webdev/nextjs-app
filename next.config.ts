/** @type {import('next').NextConfig} */
const nextConfig = {
  //   images: {
  //   domains: ['images.unsplash.com', 'www.zdnet.com'],
  // }
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // This allows ALL https domains , and no image error
      },
    ],
  },
};

export default nextConfig;
