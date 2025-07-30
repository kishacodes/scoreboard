globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, m as maybeRenderHead, r as renderTemplate } from './astro/server_DDu7V7oX.mjs';
/* empty css                         */

const $$ScoreboardFilter = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<form id="filter-form" class="filter-container" data-astro-cid-egvsxq6h> <div class="filter-group" data-astro-cid-egvsxq6h> <label for="search-team" data-astro-cid-egvsxq6h>Team Name</label> <input type="text" id="search-team" name="team" placeholder="Search for a team..." data-astro-cid-egvsxq6h> </div> <div class="filter-group" data-astro-cid-egvsxq6h> <label for="filter-teams" data-astro-cid-egvsxq6h>Level</label> <select id="filter-teams" name="teams" data-astro-cid-egvsxq6h> <option value="" data-astro-cid-egvsxq6h>All Levels</option> <option value="Varsity" data-astro-cid-egvsxq6h>Varsity</option> <option value="Junior Varsity" data-astro-cid-egvsxq6h>Junior Varsity</option> <option value="Freshman" data-astro-cid-egvsxq6h>Freshman</option> </select> </div> <div class="filter-group" data-astro-cid-egvsxq6h> <label for="filter-gameDate" data-astro-cid-egvsxq6h>Game Date</label> <input type="date" id="filter-gameDate" name="gameDate" data-astro-cid-egvsxq6h> </div> <div class="filter-group" data-astro-cid-egvsxq6h> <button type="reset" data-astro-cid-egvsxq6h>Clear Filters</button> </div> </form>  `;
}, "/Users/kisha/serverless/scoreboard/src/components/ScoreboardFilter.astro", void 0);

export { $$ScoreboardFilter as $ };
