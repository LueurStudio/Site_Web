import { NextRequest } from 'next/server';

export async function checkAuth(request: NextRequest) {
  const adminToken = request.cookies.get('admin_token')?.value;
  if (adminToken) {
    return true;
  }
  const authCookie = request.cookies.get('auth')?.value;
  return authCookie === 'true';
}