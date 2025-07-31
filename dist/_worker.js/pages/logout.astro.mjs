globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, a as createAstro } from '../chunks/astro/server_DDu7V7oX.mjs';
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
  throw Astro2.redirect("/login");
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
