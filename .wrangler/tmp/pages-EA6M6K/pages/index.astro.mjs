globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, a as createAstro, d as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_DDu7V7oX.mjs';
import { $ as $$Layout } from '../chunks/Layout_7kCDfOwS.mjs';
import { $ as $$ScoreboardFilter } from '../chunks/ScoreboardFilter_DsKbEPm3.mjs';
import { $ as $$ScoreboardDisplay } from '../chunks/ScoreboardDisplay_Ba9xwvpx.mjs';
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
      for (const game of games) {
        const updatesResponse = await fetch(`${Astro2.url.origin}/api/games/${game.id}/updates`);
        console.log(`Fetching updates for game ${game.id}: ${updatesResponse.status}`);
        if (updatesResponse.ok) {
          const updates = await updatesResponse.json();
          console.log(`Game ${game.id} updates:`, updates);
          game.updates = updates;
        } else {
          console.error(`Updates API Error: ${updatesResponse.status} ${updatesResponse.statusText}`);
          game.updates = [];
        }
      }
    } else {
      console.error(`API Error: ${gamesResponse.status} ${gamesResponse.statusText}`);
    }
  } catch (error) {
    console.error("Fetch Error:", error.message);
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Emerson Mavericks Football Scoreboard", "data-astro-cid-j7pv25f6": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main data-astro-cid-j7pv25f6> <header data-astro-cid-j7pv25f6> <h1 data-astro-cid-j7pv25f6>Emerson Mavericks Football</h1> </header> ${renderComponent($$result2, "ScoreboardFilter", $$ScoreboardFilter, { "data-astro-cid-j7pv25f6": true })} <div class="scoreboard-container" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "ScoreboardDisplay", $$ScoreboardDisplay, { "games": games, "data-astro-cid-j7pv25f6": true })} </div> <!-- Debug section removed --> </main> ` })}  `;
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
