import { NextResponse } from 'next/server'

export function middleware(request) {
  // Redirect root to index.html
  if (request.nextUrl.pathname === '/') {
    const url = request.nextUrl.clone()
    url.pathname = '/index.html'
    return NextResponse.rewrite(url)
  }

  // Redirect /checkout to checkout.html
  if (request.nextUrl.pathname === '/checkout') {
    const url = request.nextUrl.clone()
    url.pathname = '/checkout.html'
    return NextResponse.rewrite(url)
  }

  // Redirect /success to success.html
  if (request.nextUrl.pathname === '/success') {
    const url = request.nextUrl.clone()
    url.pathname = '/success.html'
    return NextResponse.rewrite(url)
  }

  // Redirect /admin-pagos to admin-pagos.html
  if (request.nextUrl.pathname === '/admin-pagos') {
    const url = request.nextUrl.clone()
    url.pathname = '/admin-pagos.html'
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/checkout',
    '/success',
    '/admin-pagos',
  ],
}