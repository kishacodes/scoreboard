globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, a as createAstro, d as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_DDu7V7oX.mjs';
import { $ as $$Layout } from '../chunks/Layout_D6cK0AyW.mjs';
import { $ as $$ScoreboardFilter } from '../chunks/ScoreboardFilter_DIsi3rzV.mjs';
import { $ as $$ScoreboardDisplay } from '../chunks/ScoreboardDisplay_Cm18vxaD.mjs';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  let games = [];
  try {
    const gamesResponse = await fetch(`${Astro2.url.origin}/api/games`);
    if (gamesResponse.ok) {
      games = await gamesResponse.json();
    } else {
    }
  } catch (error) {
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Emerson Mavericks Football Scoreboard", "data-astro-cid-j7pv25f6": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main data-astro-cid-j7pv25f6> <header data-astro-cid-j7pv25f6> <h1 data-astro-cid-j7pv25f6>Emerson Mavericks Football</h1> </header> ${renderComponent($$result2, "ScoreboardFilter", $$ScoreboardFilter, { "data-astro-cid-j7pv25f6": true })} <div class="scoreboard-container" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "ScoreboardDisplay", $$ScoreboardDisplay, { "games": games, "data-astro-cid-j7pv25f6": true })} </div> <!-- Debug section removed --> </main> ` })} `;
}, "/Users/kisha/serverless/scoreboard/src/pages/index.astro", void 0);

const $$file = "/Users/kisha/serverless/scoreboard/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
