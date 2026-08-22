/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    dangerouslyAllowSVG: true,
    dangerouslyAllowLocalIP: true,
    localPatterns: [
      {
        pathname: '/api/destination-image',
        search: '?name=*&country=*',
      },
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

export default nextConfig
