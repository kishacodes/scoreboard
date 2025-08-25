globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_DDu7V7oX.mjs';
import { $ as $$Layout } from '../chunks/Layout_7kCDfOwS.mjs';
import { $ as $$ScoreboardDisplay } from '../chunks/ScoreboardDisplay_UlH86ste.mjs';
/* empty css                                       */
export { renderers } from '../renderers.mjs';

const $$Debugupdate = createComponent(($$result, $$props, $$slots) => {
  const mockGames = [
    {
      id: 31,
      teams: "varsity",
      ehs: "Emerson High",
      opp: "McKinney",
      gameDate: "2025-08-23",
      comments: "Home game",
      ehsScore: 28,
      oppScore: 14,
      ehsFinal: 0,
      oppFinal: 0,
      final: 0,
      qtr: "2nd quarter",
      timeInqtr: "7:32",
      level: "varsity",
      createdAt: "2025-08-24 19:06:05",
      updates: [
        {
          id: 1,
          game_id: 31,
          user_email: "coach@example.com",
          update_text: "Touchdown by #12 Smith! Emerson takes the lead.",
          created_at: "2025-08-23 19:45:00"
        },
        {
          id: 2,
          game_id: 31,
          user_email: "coach@example.com",
          update_text: "End of first quarter: Emerson 7, McKinney 0",
          created_at: "2025-08-23 19:30:00"
        },
        {
          id: 3,
          game_id: 31,
          user_email: "coach@example.com",
          update_text: "Game started! Emerson received the kickoff.",
          created_at: "2025-08-23 19:00:00"
        }
      ]
    },
    {
      id: 11,
      teams: "junior varsity",
      ehs: "Emerson High",
      opp: "McKinney",
      gameDate: "2025-08-28",
      comments: "Season opener",
      ehsScore: 0,
      oppScore: 0,
      ehsFinal: 0,
      oppFinal: 0,
      final: 0,
      qtr: null,
      timeInqtr: null,
      level: "jv",
      createdAt: "2025-07-18 00:58:48",
      updates: []
      // No updates for this game
    }
  ];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Debug Updates - Emerson Mavericks Football Scoreboard", "data-astro-cid-2ztnkiy5": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main data-astro-cid-2ztnkiy5> <header data-astro-cid-2ztnkiy5> <h1 data-astro-cid-2ztnkiy5>Debug Updates Display</h1> <p data-astro-cid-2ztnkiy5>This page contains mock data with game updates to test the display component</p> </header> <div class="scoreboard-container" data-astro-cid-2ztnkiy5> ${renderComponent($$result2, "ScoreboardDisplay", $$ScoreboardDisplay, { "games": mockGames, "data-astro-cid-2ztnkiy5": true })} </div> <div class="debug-json" data-astro-cid-2ztnkiy5> <h3 data-astro-cid-2ztnkiy5>Mock Data Structure</h3> <pre data-astro-cid-2ztnkiy5>${JSON.stringify(mockGames, null, 2)}</pre> </div> </main> ` })} `;
}, "/Users/kisha/serverless/scoreboard/src/pages/debugupdate.astro", void 0);

const $$file = "/Users/kisha/serverless/scoreboard/src/pages/debugupdate.astro";
const $$url = "/debugupdate";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Debugupdate,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
