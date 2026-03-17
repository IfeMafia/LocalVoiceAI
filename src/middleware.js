import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret-change-this';
const TOKEN_NAME = 'voxy_auth_token';

// Map roles to their respective dashboards
const ROLE_DASHBOARDS = {
  customer: '/customer/chat',
  business_owner: '/business/dashboard',
  admin: '/lighthouse/dashboard'
};

export async function middleware(request) {
  const { nextUrl, cookies } = request;
  const token = cookies.get(TOKEN_NAME)?.value;

  const isAuthPage = nextUrl.pathname.startsWith('/login') || nextUrl.pathname.startsWith('/register');
  const isProtectedPage = nextUrl.pathname.startsWith('/customer') || 
                           nextUrl.pathname.startsWith('/business') || 
                           nextUrl.pathname.startsWith('/lighthouse');

  if (!token) {
    if (isProtectedPage) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    
    const userRole = payload.role;
    const targetDashboard = ROLE_DASHBOARDS[userRole] || ROLE_DASHBOARDS.business_owner;

    // If on login/register, redirect to dashboard
    if (isAuthPage) {
      return NextResponse.redirect(new URL(targetDashboard, request.url));
    }

    // Role-based protection: Ensure user is on the correct dashboard
    if (nextUrl.pathname.startsWith('/customer') && userRole !== 'customer') {
      return NextResponse.redirect(new URL(targetDashboard, request.url));
    }
    if (nextUrl.pathname.startsWith('/business') && userRole !== 'business_owner') {
      return NextResponse.redirect(new URL(targetDashboard, request.url));
    }
    if (nextUrl.pathname.startsWith('/lighthouse') && userRole !== 'admin') {
      return NextResponse.redirect(new URL(targetDashboard, request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware JWT Error:', error);
    // If token is invalid, clear it and redirect to login if protected
    if (isProtectedPage) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete(TOKEN_NAME);
      return response;
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/login',
    '/register',
    '/customer/:path*',
    '/business/:path*',
    '/lighthouse/:path*'
  ],
};
