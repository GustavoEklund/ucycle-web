export { default } from 'next-auth/middleware'

export const config = {
  matcher: [
    '/product/add',
    '/orders',
    '/orders/:path*',
    '/shopping-cart/:path*',
    '/checkout/:path*',
  ]
}
