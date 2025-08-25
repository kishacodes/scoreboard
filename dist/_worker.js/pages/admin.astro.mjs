globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, a as createAstro, m as maybeRenderHead, b as addAttribute, r as renderTemplate, d as renderComponent } from '../chunks/astro/server_DDu7V7oX.mjs';
import { $ as $$Layout } from '../chunks/Layout_Dmqzje98.mjs';
import { $ as $$ScoreboardFilter } from '../chunks/ScoreboardFilter_CfQm_gX1.mjs';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const $$Astro$1 = createAstro();
const $$AdminScoreboardDisplay = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$AdminScoreboardDisplay;
  const { games } = Astro2.props;
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };
  const toTitleCase = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };
  return renderTemplate`${maybeRenderHead()}<div class="scoreboard-grid" id="admin-scoreboard" data-astro-cid-hl7zq6gi> ${games.map((game) => renderTemplate`<div class="game-card"${addAttribute(game.id, "data-game-id")} data-astro-cid-hl7zq6gi> <div class="game-header" data-astro-cid-hl7zq6gi> <span class="game-date" data-astro-cid-hl7zq6gi>${formatDate(game.gameDate)}</span> <span class="game-level" data-astro-cid-hl7zq6gi>${toTitleCase(game.teams)}</span> </div> <div class="game-body" data-astro-cid-hl7zq6gi> <div class="team" data-astro-cid-hl7zq6gi> <span class="team-name" data-astro-cid-hl7zq6gi>${game.ehs}</span> <input type="number" class="team-score-input"${addAttribute(game.ehsScore, "value")} data-astro-cid-hl7zq6gi> </div> <div class="team" data-astro-cid-hl7zq6gi> <span class="team-name" data-astro-cid-hl7zq6gi>${game.opp}</span> <input type="number" class="team-score-input"${addAttribute(game.oppScore, "value")} data-astro-cid-hl7zq6gi> </div> </div> <div class="game-update-section" data-astro-cid-hl7zq6gi> <div class="update-input-group" data-astro-cid-hl7zq6gi> <div class="game-meta-inputs" data-astro-cid-hl7zq6gi> <select class="quarter-select" aria-label="Quarter" data-astro-cid-hl7zq6gi> <option value="" data-astro-cid-hl7zq6gi>-- Quarter --</option> <option value="1st quarter" data-astro-cid-hl7zq6gi>1st Quarter</option> <option value="2nd quarter" data-astro-cid-hl7zq6gi>2nd Quarter</option> <option value="3rd quarter" data-astro-cid-hl7zq6gi>3rd Quarter</option> <option value="4th quarter" data-astro-cid-hl7zq6gi>4th Quarter</option> </select> <input type="text" class="time-input" placeholder="Time (e.g. 4:30)" aria-label="Time in quarter" data-astro-cid-hl7zq6gi> </div> <input type="text" class="update-text-input" placeholder="Add update note (optional)"${addAttribute(game.id, "data-game-id")} data-astro-cid-hl7zq6gi> <button class="update-button" data-astro-cid-hl7zq6gi>Update Score</button> </div> <div class="update-history"${addAttribute(`update-history-${game.id}`, "id")} data-astro-cid-hl7zq6gi></div> </div> </div>`)} </div>  `;
}, "/Users/kisha/serverless/scoreboard/src/components/AdminScoreboardDisplay.astro", void 0);

const $$Astro = createAstro();
const $$Admin = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Admin;
  const { DB } = Astro2.locals.runtime.env;
  const { results: games } = await DB.prepare("SELECT * FROM games2025 ORDER BY gameDate ASC").all();
  const userEmail = Astro2.locals.user?.email ?? null;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Scoreboard Admin - Emerson Mavericks Football", "data-astro-cid-2zp6q64z": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="container" data-page="admin" data-astro-cid-2zp6q64z> <h1 data-astro-cid-2zp6q64z>Scoreboard Admin</h1> <h4 class="welcome-message" data-astro-cid-2zp6q64z>Welcome, ${userEmail ?? "Guest"}!</h4> ${renderComponent($$result2, "ScoreboardFilter", $$ScoreboardFilter, { "data-astro-cid-2zp6q64z": true })} <div class="scoreboard-container" data-astro-cid-2zp6q64z> ${renderComponent($$result2, "AdminScoreboardDisplay", $$AdminScoreboardDisplay, { "games": games, "data-astro-cid-2zp6q64z": true })} </div> </main> ` })} `;
}, "/Users/kisha/serverless/scoreboard/src/pages/admin.astro", void 0);

const $$file = "/Users/kisha/serverless/scoreboard/src/pages/admin.astro";
const $$url = "/admin";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Admin,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
