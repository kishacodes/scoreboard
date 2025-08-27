globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_DDu7V7oX.mjs';
import { $ as $$Layout } from '../chunks/Layout_D6cK0AyW.mjs';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const $$Login = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Login - Emerson Mavericks Football", "data-astro-cid-sgpqyurt": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="container" data-astro-cid-sgpqyurt> <h1 data-astro-cid-sgpqyurt>Login</h1> <form id="login-form" class="login-form" data-astro-cid-sgpqyurt> <label for="email" data-astro-cid-sgpqyurt>Email</label> <input type="email" id="email" name="email" required autocomplete="username" data-astro-cid-sgpqyurt> <label for="password" data-astro-cid-sgpqyurt>Password</label> <input type="password" id="password" name="password" required autocomplete="current-password" data-astro-cid-sgpqyurt> <button type="submit" data-astro-cid-sgpqyurt>Login</button> <p id="login-error" class="error-message" data-astro-cid-sgpqyurt></p> </form> </main> ` })}  `;
}, "/Users/kisha/serverless/scoreboard/src/pages/login.astro", void 0);

const $$file = "/Users/kisha/serverless/scoreboard/src/pages/login.astro";
const $$url = "/login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Login,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
