import { defineMiddleware } from 'astro:middleware';
import { app } from './server';

export const onRequest = defineMiddleware(async (context, next) => {
  const runtime = context.locals.runtime;
  if (context.url.pathname.startsWith('/api')) {
    if (runtime) {
      return app.fetch(context.request, runtime.env, runtime.ctx);
    }
  }
  return next();
});
