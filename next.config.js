// /** @type {import('next').NextConfig} */

// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//     enabled: process.env.ANALYZE === 'true',
//   })

// const nextConfig = {
//   images: {
//     remotePatterns: [
//       protocol: 'https',
//       hostname: "media-be.chewy.com",
//       port: '',
//     ]
//   }
// }

// module.exports = withBundleAnalyzer(nextConfig)

module.exports = {
  images: {
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
      }
    ],
  },
}