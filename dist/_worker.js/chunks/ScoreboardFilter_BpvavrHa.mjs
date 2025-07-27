globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, a as createAstro, b as addAttribute, e as renderHead, f as renderSlot, r as renderTemplate, m as maybeRenderHead } from './astro/server_DDu7V7oX.mjs';
/* empty css                         */

const $$Astro = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title } = Astro2.props;
  return renderTemplate`<html lang="en"> <head><meta charset="UTF-8"><meta name="description" content="Emerson High School Football Scoreboard"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"${addAttribute(Astro2.generator, "content")}><title>${title}</title>${renderHead()}</head> <body> <header> <nav> <a href="/">Scoreboard</a> <a href="/admin">Admin</a> </nav> </header> ${renderSlot($$result, $$slots["default"])} </body></html>`;
}, "/Users/kisha/serverless/scoreboard/src/layouts/Layout.astro", void 0);

const $$ScoreboardFilter = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<form id="filter-form" class="filter-container" data-astro-cid-egvsxq6h> <div class="filter-group" data-astro-cid-egvsxq6h> <label for="search-team" data-astro-cid-egvsxq6h>Team Name</label> <input type="text" id="search-team" name="team" placeholder="Search for a team..." data-astro-cid-egvsxq6h> </div> <div class="filter-group" data-astro-cid-egvsxq6h> <label for="filter-teams" data-astro-cid-egvsxq6h>Level</label> <select id="filter-teams" name="teams" data-astro-cid-egvsxq6h> <option value="" data-astro-cid-egvsxq6h>All Levels</option> <option value="Varsity" data-astro-cid-egvsxq6h>Varsity</option> <option value="Junior Varsity" data-astro-cid-egvsxq6h>Junior Varsity</option> <option value="Freshman" data-astro-cid-egvsxq6h>Freshman</option> </select> </div> <div class="filter-group" data-astro-cid-egvsxq6h> <label for="filter-gameDate" data-astro-cid-egvsxq6h>Game Date</label> <input type="date" id="filter-gameDate" name="gameDate" data-astro-cid-egvsxq6h> </div> <div class="filter-group" data-astro-cid-egvsxq6h> <button type="reset" data-astro-cid-egvsxq6h>Clear Filters</button> </div> </form>  `;
}, "/Users/kisha/serverless/scoreboard/src/components/ScoreboardFilter.astro", void 0);

export { $$ScoreboardFilter as $, $$Layout as a };
