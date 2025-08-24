import { defineMiddleware } from 'astro:middleware';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode('REPLACE_THIS_WITH_A_SECRET_KEY'); // Should match server

export const onRequest = defineMiddleware(async (context, next) => {
  const { cookies, url, redirect, locals } = context;
  const token = cookies.get('auth')?.value;
  if (!token) {
    return redirect('/login');
  }
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    locals.user = payload as {
      userid: string;
      email: string;
      role: string;
      [key: string]: unknown;
    };
    return next();
  } catch (e) {
    return redirect('/login');
  }
});
