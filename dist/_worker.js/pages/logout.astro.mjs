globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, a as createAstro, d as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_DDu7V7oX.mjs';
import { $ as $$Layout } from '../chunks/Layout_D6cK0AyW.mjs';
/* empty css                                  */
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Logout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Logout;
  Astro2.cookies.set("auth", "", {
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 0
  });
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Logged Out - Emerson Mavericks Football", "data-astro-cid-7lhwsxme": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="container" data-astro-cid-7lhwsxme> <h1 data-astro-cid-7lhwsxme>Logged Out</h1> <p data-astro-cid-7lhwsxme>You have been successfully logged out.</p> <p data-astro-cid-7lhwsxme>Redirecting you to the homepage...</p>  </main> ` })} `;
}, "/Users/kisha/serverless/scoreboard/src/pages/logout.astro", void 0);

const $$file = "/Users/kisha/serverless/scoreboard/src/pages/logout.astro";
const $$url = "/logout";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Logout,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
