import withPWA from 'next-pwa'
import type { NextConfig } from 'next'

const isDev = process.env.NODE_ENV === 'development'

const nextConfig: NextConfig = {
  images: {
    domains: ['i.imgur.com']
  },
  reactStrictMode: true
}

const withPWANextConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: isDev, // 👈 importante
  // 👇 Usa tu propio service worker
  customWorkerDir: 'public',
  swSrc: 'public/custom-sw.js',
})(nextConfig)

export default withPWANextConfig
