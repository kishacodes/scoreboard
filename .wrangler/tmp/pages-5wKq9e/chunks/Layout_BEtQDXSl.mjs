globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, a as createAstro, b as addAttribute, e as renderHead, f as renderSlot, r as renderTemplate } from './astro/server_DDu7V7oX.mjs';
/* empty css                         */

const $$Astro = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title } = Astro2.props;
  return renderTemplate`<html lang="en"> <head><meta charset="UTF-8"><meta name="description" content="Emerson High School Football Scoreboard"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"${addAttribute(Astro2.generator, "content")}><title>${title}</title>${renderHead()}</head> <body> <header> <nav> <a href="/">Scoreboard</a> <a href="/admin">Admin</a> <a href="/api/logout" style="margin-left:1rem;">Logout</a> </nav> </header> ${renderSlot($$result, $$slots["default"])} </body></html>`;
}, "/Users/kisha/serverless/scoreboard/src/layouts/Layout.astro", void 0);

export { $$Layout as $ };
