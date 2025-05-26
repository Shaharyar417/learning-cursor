import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const PUBLIC_PATHS = [
    '/auth/signin',
    '/auth/register',
    '/favicon.ico',
    '/_next',
    '/api', // allow API routes
];

export async function middleware(req) {
    const { pathname } = req.nextUrl;

    // Allow public paths
    if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
        return NextResponse.next();
    }

    // Check for session token
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
        const loginUrl = new URL('/auth/signin', req.url);
        loginUrl.searchParams.set('callbackUrl', req.url);
        return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next|favicon.ico|api|auth/signin|auth/register).*)',
    ],
}; 