import { defineMiddleware } from 'astro:middleware';
import { app } from './server';

import { jwtVerify } from 'jose';

export const onRequest = defineMiddleware(async (context, next) => {
  const runtime = context.locals.runtime;
  const { url, cookies, redirect, locals } = context;

  // API proxy
  if (url.pathname.startsWith('/api')) {
    if (runtime) {
      return app.fetch(context.request, runtime.env, runtime.ctx);
    }
  }

  // SSR Admin route protection
  if (url.pathname.startsWith('/admin')) {
    const token = cookies.get('auth')?.value;
    if (!token) return redirect('/login');
    try {
      const { payload } = await jwtVerify(token, new TextEncoder().encode('REPLACE_THIS_WITH_A_SECRET_KEY'));
      locals.user = payload;
    } catch (e) {
      return redirect('/login');
    }
  }

  return next();
});
