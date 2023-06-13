const withTM = require('next-transpile-modules')(['@mercadopago/sdk-react'])
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
})

/** @type {import('next').NextConfig} */
const nextConfig = withTM(withPWA({
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost']
  }
}))

module.exports = nextConfig
