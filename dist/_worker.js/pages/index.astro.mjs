globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, a as createAstro, m as maybeRenderHead, r as renderTemplate, d as renderComponent } from '../chunks/astro/server_DDu7V7oX.mjs';
import { $ as $$Layout } from '../chunks/Layout_7kCDfOwS.mjs';
import { $ as $$ScoreboardFilter } from '../chunks/ScoreboardFilter_CfQm_gX1.mjs';
import { $ as $$ScoreboardDisplay } from '../chunks/ScoreboardDisplay_CUO3sEsq.mjs';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const $$Astro$1 = createAstro();
const $$DebugDisplay = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DebugDisplay;
  const { data, title = "Debug Data" } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="debug-container" data-astro-cid-25ac42v7> <h3 class="debug-title" data-astro-cid-25ac42v7>${title}</h3> <pre class="debug-content" data-astro-cid-25ac42v7>${JSON.stringify(data, null, 2)}</pre> </div> `;
}, "/Users/kisha/serverless/scoreboard/src/components/DebugDisplay.astro", void 0);

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
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Emerson Mavericks Football Scoreboard", "data-astro-cid-j7pv25f6": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main data-astro-cid-j7pv25f6> <header data-astro-cid-j7pv25f6> <h1 data-astro-cid-j7pv25f6>Emerson Mavericks Football</h1> </header> ${renderComponent($$result2, "ScoreboardFilter", $$ScoreboardFilter, { "data-astro-cid-j7pv25f6": true })} <div class="scoreboard-container" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "ScoreboardDisplay", $$ScoreboardDisplay, { "games": games, "data-astro-cid-j7pv25f6": true })} </div> <div class="debug-section" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "DebugDisplay", $$DebugDisplay, { "data": games, "title": "Games Data (Including Updates)", "data-astro-cid-j7pv25f6": true })} </div> </main> ` })}  `;
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
