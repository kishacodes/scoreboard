globalThis.process ??= {}; globalThis.process.env ??= {};
import { N as NOOP_MIDDLEWARE_HEADER } from './astro/server_DDu7V7oX.mjs';

const NOOP_MIDDLEWARE_FN = async (_ctx, next) => {
  const response = await next();
  response.headers.set(NOOP_MIDDLEWARE_HEADER, "true");
  return response;
};

export { NOOP_MIDDLEWARE_FN as N };
