import type { APIRoute } from 'astro';
import { jwtVerify } from 'jose';

// Ensure this EXACTLY matches the secret in src/server/index.ts
const JWT_SECRET = new TextEncoder().encode('REPLACE_THIS_WITH_A_SECRET_KEY');

export function withAuth(handler: APIRoute, options: { role?: string } = {}) {
  return async (context: any, ...args: any[]) => {
    const { request, locals, cookies, redirect } = context;
    
    // Check authorization header first (for API requests)
    const authHeader = request.headers.get('Authorization');
    let token = '';
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
      console.log('🔑 withAuth - Token found in Authorization header');
    } else {
      // Then check cookies
      token = cookies.get('auth')?.value || '';
      console.log('🔑 withAuth - Token found in cookies:', token ? 'Yes' : 'No');
    }
    
    if (!token) {
      console.log('❌ withAuth - No token found');
      return redirect('/login');
    }
    
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      console.log('✅ withAuth - Token verified successfully');
      
      if (options.role && payload.role !== options.role) {
        console.log('❌ withAuth - Role mismatch: required', options.role, 'but got', payload.role);
        return new Response('Forbidden', { status: 403 });
      }
      
      context.locals.user = payload;
      return handler(context, ...args);
    } catch (e) {
      console.error('❌ withAuth - Token verification failed:', e);
      return redirect('/login');
    }
  };
}
