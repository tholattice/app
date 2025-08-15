const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance optimizations
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      '@heroicons/react', 
      '@headlessui/react', 
      'framer-motion',
      'lucide-react',
      'clsx',
      'tailwind-merge',
      'date-fns',
      'lodash'
    ],
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },

  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: "media-be.chewy.com",
        port: '',
      },
      {
        protocol: 'https',
        hostname: "www.tholattice.com",
        port: '',
      },
      {
        protocol: 'https',
        hostname: "img.freepik.com",
        port: ''
      },
      {
        protocol: 'https',
        hostname: "images.squarespace-cdn.com",
        port: ''
      },
      {
        protocol: 'https',
        hostname: "i0.wp.com",
        port: ''
      },
      {
        protocol: 'https',
        hostname: "static.showit.co",
        port: ''
      },
      {
        protocol: 'https',
        hostname: "jacqueline.themerex.net",
        port: ''
      },
      {
        protocol: 'https',
        hostname: "wallpaperxyz.com",
        port: ''
      },
      {
        protocol: 'https',
        hostname: "images.pexels.com",
        port: ''
      },
      {
        protocol: 'https',
        hostname: "media.istockphoto.com",
        port: ''
      },
      {
        protocol: 'https',
        hostname: "images.unsplash.com",
        port: ''
      },
      {
        protocol: 'https',
        hostname: "c.stocksy.com",
        port: ''
      },
      {
        protocol: 'https',
        hostname: "i.pinimg.com",
        port: ''
      },
      {
        protocol: 'https',
        hostname: "lh3.googleusercontent.com",
        port: ''
      }
    ],
  },

  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Enhanced bundle optimization
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        maxInitialRequests: 25,
        minSize: 20000,
        cacheGroups: {
          default: {
            minChunks: 1,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            chunks: 'all',
          },
          // Separate React and Next.js
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react',
            priority: 40,
            chunks: 'all',
          },
          // Separate Next.js
          next: {
            test: /[\\/]node_modules[\\/](next)[\\/]/,
            name: 'next',
            priority: 30,
            chunks: 'all',
          },
          // Separate UI libraries
          ui: {
            test: /[\\/]node_modules[\\/](@headlessui|@heroicons|lucide-react)[\\/]/,
            name: 'ui',
            priority: 20,
            chunks: 'all',
          },
          // Separate utility libraries
          utils: {
            test: /[\\/]node_modules[\\/](lodash|date-fns|clsx|tailwind-merge)[\\/]/,
            name: 'utils',
            priority: 15,
            chunks: 'all',
          },
        },
      };

      // Tree shaking optimization
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
    }

    // Optimize SVG imports
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },

  // Compression and caching
  compress: true,
  poweredByHeader: false,
  generateEtags: false,

  // Headers for performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=30, stale-while-revalidate=60',
          },
        ],
      },
      {
        source: '/dashboard/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=30, stale-while-revalidate=60',
          },
        ],
      },
    ];
  },

  // Redirects for performance
  async redirects() {
    return [
      // Remove this redirect as it's causing issues
      // {
      //   source: '/dashboard',
      //   destination: '/dashboard/',
      //   permanent: true,
      // },
    ];
  },
};

module.exports = withBundleAnalyzer(nextConfig);