const nextConfig = {
  output: 'export',
  basePath: '/product-management-front',
  distDir: 'out',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.dummyjson.com',
      },
    ],
  },
  experimental: {
    typedRoutes: true,
  },
};

export default nextConfig;
