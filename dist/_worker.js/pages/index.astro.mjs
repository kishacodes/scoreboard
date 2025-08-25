globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, a as createAstro, m as maybeRenderHead, r as renderTemplate, d as renderComponent } from '../chunks/astro/server_DDu7V7oX.mjs';
import { $ as $$Layout } from '../chunks/Layout_Dmqzje98.mjs';
import { $ as $$ScoreboardFilter } from '../chunks/ScoreboardFilter_CfQm_gX1.mjs';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const $$Astro$1 = createAstro();
const $$ScoreboardDisplay = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$ScoreboardDisplay;
  const { games } = Astro2.props;
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };
  const toTitleCase = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };
  return renderTemplate`${maybeRenderHead()}<div class="scoreboard-grid" data-astro-cid-f4kmggoj> ${games.map((game) => renderTemplate`<div class="game-card" data-astro-cid-f4kmggoj> <div class="game-header" data-astro-cid-f4kmggoj> <span class="game-date" data-astro-cid-f4kmggoj>${formatDate(game.gameDate)}</span> <span class="game-level" data-astro-cid-f4kmggoj>${toTitleCase(game.teams)}</span> </div> <div class="game-body" data-astro-cid-f4kmggoj> <div class="team" data-astro-cid-f4kmggoj> <span class="team-name" data-astro-cid-f4kmggoj>${game.ehs}</span> <span class="team-score" data-astro-cid-f4kmggoj>${game.ehsScore}</span> </div> <div class="team" data-astro-cid-f4kmggoj> <span class="team-name" data-astro-cid-f4kmggoj>${game.opp}</span> <span class="team-score" data-astro-cid-f4kmggoj>${game.oppScore}</span> </div> ${(game.qtr || game.timeInqtr) && renderTemplate`<div class="game-status" data-astro-cid-f4kmggoj> ${game.qtr && renderTemplate`<span class="game-quarter" data-astro-cid-f4kmggoj>${game.qtr}</span>`} ${game.timeInqtr && renderTemplate`<span class="game-time" data-astro-cid-f4kmggoj>${game.timeInqtr}</span>`} </div>`} </div> <div class="game-footer" data-astro-cid-f4kmggoj> ${game.comments && renderTemplate`<p class="game-comment" data-astro-cid-f4kmggoj>${game.comments}</p>`} ${game.updates && game.updates.length > 0 && renderTemplate`<div class="game-updates" data-astro-cid-f4kmggoj> <h4 class="updates-heading" data-astro-cid-f4kmggoj>Recent Updates</h4> <ul class="updates-list" data-astro-cid-f4kmggoj> ${game.updates.map((update) => renderTemplate`<li class="update-item" data-astro-cid-f4kmggoj> <span class="update-text" data-astro-cid-f4kmggoj>${update.update_text}</span> <span class="update-timestamp" data-astro-cid-f4kmggoj>${update.created_at}</span> </li>`)} </ul> </div>`} </div> </div>`)} </div> `;
}, "/Users/kisha/serverless/scoreboard/src/components/ScoreboardDisplay.astro", void 0);

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
        if (updatesResponse.ok) {
          game.updates = await updatesResponse.json();
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
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Emerson Mavericks Football Scoreboard", "data-astro-cid-j7pv25f6": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main data-astro-cid-j7pv25f6> <header data-astro-cid-j7pv25f6> <h1 data-astro-cid-j7pv25f6>Emerson Mavericks Football</h1> </header> ${renderComponent($$result2, "ScoreboardFilter", $$ScoreboardFilter, { "data-astro-cid-j7pv25f6": true })} <div class="scoreboard-container" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "ScoreboardDisplay", $$ScoreboardDisplay, { "games": games, "data-astro-cid-j7pv25f6": true })} </div> </main> ` })}  `;
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
