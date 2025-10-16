import { NextResponse } from 'next/server';

export async function GET() {
  const config = {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Not set',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Not set',
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID ? 'Set' : 'Not set',
      clientSecret: process.env.GITHUB_CLIENT_SECRET ? 'Set' : 'Not set',
    },
    slack: {
      clientId: process.env.SLACK_CLIENT_ID ? 'Set' : 'Not set',
      clientSecret: process.env.SLACK_CLIENT_SECRET ? 'Set' : 'Not set',
    },
    nextauth: {
      url: process.env.NEXTAUTH_URL,
      secret: process.env.NEXTAUTH_SECRET ? 'Set' : 'Not set',
    },
    database: {
      url: process.env.DATABASE_URL ? 'Set' : 'Not set',
    },
  };

  return NextResponse.json(config);
} 