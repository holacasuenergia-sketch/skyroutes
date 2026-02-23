/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  rewrites: async () => {
    return [
      {
        source: '/checkout',
        destination: '/checkout.html',
      },
      {
        source: '/success',
        destination: '/success.html',
      },
      {
        source: '/admin-pagos',
        destination: '/admin-pagos.html',
      },
      {
        source: '/',
        destination: '/index.html',
      },
    ]
  },
}

module.exports = nextConfig