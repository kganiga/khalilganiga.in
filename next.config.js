const { withContentlayer } = require('next-contentlayer2')

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,

  // REQUIRED for Cloudflare Pages
  output: 'export',

  // Static sites cannot use Next Image optimization
  images: {
    unoptimized: true,
  },

  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],

  eslint: {
    dirs: ['app', 'components', 'layouts', 'scripts'],
  },

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })
    return config
  },
}

module.exports = withBundleAnalyzer(withContentlayer(nextConfig))
