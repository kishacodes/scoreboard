globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, a as createAstro, m as maybeRenderHead, b as addAttribute, r as renderTemplate } from './astro/server_DDu7V7oX.mjs';
/* empty css                               */

const $$Astro = createAstro();
const $$ScoreboardDisplay = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
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
  return renderTemplate`${maybeRenderHead()}<div class="scoreboard-grid" data-astro-cid-f4kmggoj> ${games.map((game) => renderTemplate`<div class="game-card"${addAttribute(game.id, "data-game-id")} data-astro-cid-f4kmggoj> <div class="game-header" data-astro-cid-f4kmggoj> <span class="game-date" data-astro-cid-f4kmggoj>${formatDate(game.gameDate)}</span> <span class="game-level" data-astro-cid-f4kmggoj>${toTitleCase(game.teams)}</span> </div> <div class="game-body" data-astro-cid-f4kmggoj> <div class="team" data-astro-cid-f4kmggoj> <span class="team-name" data-astro-cid-f4kmggoj>${game.ehs}</span> <span class="team-score" data-astro-cid-f4kmggoj>${game.ehsScore}</span> </div> <div class="team" data-astro-cid-f4kmggoj> <span class="team-name" data-astro-cid-f4kmggoj>${game.opp}</span> <span class="team-score" data-astro-cid-f4kmggoj>${game.oppScore}</span> </div> ${game.final === 1 ? renderTemplate`<div class="game-status" data-astro-cid-f4kmggoj> <span class="game-final" data-astro-cid-f4kmggoj>FINAL</span> </div>` : (game.qtr || game.timeInqtr) && renderTemplate`<div class="game-status" data-astro-cid-f4kmggoj> ${game.qtr && renderTemplate`<span class="game-quarter" data-astro-cid-f4kmggoj>${game.qtr}</span>`} ${game.timeInqtr && renderTemplate`<span class="game-time" data-astro-cid-f4kmggoj>${game.timeInqtr}</span>`} </div>`} </div> <div class="game-footer" data-astro-cid-f4kmggoj> ${game.comments && renderTemplate`<p class="game-comment" data-astro-cid-f4kmggoj>${game.comments}</p>`} <div class="game-updates" data-astro-cid-f4kmggoj> <details class="updates-details" data-loaded="false" data-astro-cid-f4kmggoj> <summary class="updates-heading" data-astro-cid-f4kmggoj>Recent Updates</summary> <ul class="updates-list" aria-live="polite" data-astro-cid-f4kmggoj></ul> </details> </div> </div> </div>`)} </div>  `;
}, "/Users/kisha/serverless/scoreboard/src/components/ScoreboardDisplay.astro", void 0);

export { $$ScoreboardDisplay as $ };
