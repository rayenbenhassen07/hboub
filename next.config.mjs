/** @type {import('next').NextConfig} */
const nextConfig = {
  
  experimental: {
    appDir: true,
  },
  images: {
    remotePatterns: [
        {
            protocol: 'https',
            hostname: 'lh3.googleusercontent.com',
            pathname: '**',
        },
        {
            protocol: 'https',
            hostname: 'real-estate-web-storage.s3.amazonaws.com',
            pathname: '**',
        },
    ],
  },
  
  output:"standalone",
}
export default nextConfig;
