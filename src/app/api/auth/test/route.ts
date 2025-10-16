import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    // Test if we can get a session (this will test the auth configuration)
    const session = await getServerSession(authOptions);
    
    return NextResponse.json({
      status: 'success',
      message: 'NextAuth configuration is working',
      session: session ? 'Authenticated' : 'Not authenticated',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('NextAuth test error:', error);
    return NextResponse.json({
      status: 'error',
      message: 'NextAuth configuration error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
