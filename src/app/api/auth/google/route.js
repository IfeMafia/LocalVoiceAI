import { NextResponse } from 'next/server';
import { getBaseUrl } from '@/lib/utils';

export async function GET(req) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = `${getBaseUrl()}/api/auth/google/callback`;

  const { searchParams } = new URL(req.url);
  const role = searchParams.get('role') || 'customer'; // default fallback only for direct hits

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'select_account',
    state: role, // pass role through OAuth state
  });

  return NextResponse.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
}
