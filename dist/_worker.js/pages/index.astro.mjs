globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, a as createAstro, m as maybeRenderHead, r as renderTemplate, d as renderComponent } from '../chunks/astro/server_DDu7V7oX.mjs';
import { $ as $$Layout } from '../chunks/Layout_D0ZliRir.mjs';
import { $ as $$ScoreboardFilter } from '../chunks/ScoreboardFilter_C5zgotwY.mjs';
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
  return renderTemplate`${maybeRenderHead()}<div class="scoreboard-grid"> ${games.map((game) => renderTemplate`<div class="game-card"> <div class="game-header"> <span class="game-date">${formatDate(game.gameDate)}</span> <span class="game-level">${toTitleCase(game.teams)}</span> </div> <div class="game-body"> <div class="team"> <span class="team-name">${game.ehs}</span> <span class="team-score">${game.ehsFinal}</span> </div> <div class="team"> <span class="team-name">${game.opp}</span> <span class="team-score">${game.oppFinal}</span> </div> </div> ${game.comments && renderTemplate`<div class="game-footer"> <p class="game-comment">${game.comments}</p> </div>`} </div>`)} </div>`;
}, "/Users/kisha/serverless/scoreboard/src/components/ScoreboardDisplay.astro", void 0);

const $$Astro = createAstro();
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  let games = [];
  try {
    const response = await fetch(`${Astro2.url.origin}/api/games`);
    if (response.ok) {
      games = await response.json();
    } else {
      console.error(`API Error: ${response.status} ${response.statusText}`);
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
