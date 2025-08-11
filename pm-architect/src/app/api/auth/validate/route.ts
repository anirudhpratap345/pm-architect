import { NextResponse } from 'next/server';

export async function GET() {
  const envCheck = {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'Set' : 'Not set',
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Not set',
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Not set',
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID ? 'Set' : 'Not set',
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET ? 'Set' : 'Not set',
    DATABASE_URL: process.env.DATABASE_URL ? 'Set' : 'Not set',
    NODE_ENV: process.env.NODE_ENV,
  };

  // Check for critical missing variables
  const criticalMissing = [];
  if (!process.env.NEXTAUTH_SECRET) criticalMissing.push('NEXTAUTH_SECRET');
  if (!process.env.NEXTAUTH_URL) criticalMissing.push('NEXTAUTH_URL');

  return NextResponse.json({
    status: criticalMissing.length === 0 ? 'ok' : 'error',
    environment: envCheck,
    criticalMissing,
    timestamp: new Date().toISOString(),
  });
}
