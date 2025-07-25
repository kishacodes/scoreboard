globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, a as createAstro, b as addAttribute, r as renderHead, d as renderSlot, e as renderTemplate, m as maybeRenderHead, f as renderComponent } from '../chunks/astro/server_BHnmQ_pU.mjs';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const $$Astro$2 = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title } = Astro2.props;
  return renderTemplate`<html lang="en"> <head><meta charset="UTF-8"><meta name="description" content="Emerson High School Football Scoreboard"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"${addAttribute(Astro2.generator, "content")}><title>${title}</title>${renderHead()}</head> <body> ${renderSlot($$result, $$slots["default"])} </body></html>`;
}, "/Users/kisha/serverless/scoreboard/src/layouts/Layout.astro", void 0);

const $$ScoreboardFilter = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<form id="filter-form" class="filter-container" data-astro-cid-egvsxq6h> <div class="filter-group" data-astro-cid-egvsxq6h> <label for="search-team" data-astro-cid-egvsxq6h>Team Name</label> <input type="text" id="search-team" name="team" placeholder="Search for a team..." data-astro-cid-egvsxq6h> </div> <div class="filter-group" data-astro-cid-egvsxq6h> <label for="filter-teams" data-astro-cid-egvsxq6h>Level</label> <select id="filter-teams" name="teams" data-astro-cid-egvsxq6h> <option value="" data-astro-cid-egvsxq6h>All Levels</option> <option value="Varsity" data-astro-cid-egvsxq6h>Varsity</option> <option value="Junior Varsity" data-astro-cid-egvsxq6h>Junior Varsity</option> <option value="Freshman" data-astro-cid-egvsxq6h>Freshman</option> </select> </div> <div class="filter-group" data-astro-cid-egvsxq6h> <label for="filter-gameDate" data-astro-cid-egvsxq6h>Game Date</label> <input type="date" id="filter-gameDate" name="gameDate" data-astro-cid-egvsxq6h> </div> <div class="filter-group" data-astro-cid-egvsxq6h> <button type="reset" data-astro-cid-egvsxq6h>Clear Filters</button> </div> </form>  `;
}, "/Users/kisha/serverless/scoreboard/src/components/ScoreboardFilter.astro", void 0);

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
  return renderTemplate`${maybeRenderHead()}<div class="scoreboard-grid"> ${games.map((game) => renderTemplate`<div class="game-card"> <div class="game-header"> <span class="game-date">${formatDate(game.gameDate)}</span> <span class="game-level">${toTitleCase(game.teams)}</span> </div> <div class="game-body"> <div class="team"> <span class="team-name">${game.ehs}</span> <span class="team-score">${game.ehsFinal}</span> </div> <div class="team"> <span class="team-name">${game.opp}</span> <span class="team-score">${game.oppFinal}</span> </div> </div> </div>`)} </div>`;
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
