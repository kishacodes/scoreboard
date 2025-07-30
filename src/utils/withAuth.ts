import type { APIRoute } from 'astro';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode('REPLACE_THIS_WITH_A_SECRET_KEY'); // Should match server

export function withAuth(handler: APIRoute, options: { role?: string } = {}) {
  return async (context: any, ...args: any[]) => {
    const { request, locals, cookies, redirect } = context;
    const token = cookies.get('auth')?.value;
    if (!token) {
      return redirect('/login');
    }
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      if (options.role && payload.role !== options.role) {
        return new Response('Forbidden', { status: 403 });
      }
      context.locals.user = payload;
      return handler(context, ...args);
    } catch (e) {
      return redirect('/login');
    }
  };
}
