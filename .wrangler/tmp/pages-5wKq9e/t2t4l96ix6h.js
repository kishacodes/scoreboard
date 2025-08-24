// <define:__ROUTES__>
var define_ROUTES_default = {
  version: 1,
  include: [
    "/*"
  ],
  exclude: [
    "/_astro/*"
  ]
};

// ../../../../opt/homebrew/lib/node_modules/wrangler/templates/pages-dev-pipeline.ts
import worker from "/Users/kisha/serverless/scoreboard/.wrangler/tmp/pages-5wKq9e/bundledWorker-0.1552458741356082.mjs";
import { isRoutingRuleMatch } from "/opt/homebrew/lib/node_modules/wrangler/templates/pages-dev-util.ts";
export * from "/Users/kisha/serverless/scoreboard/.wrangler/tmp/pages-5wKq9e/bundledWorker-0.1552458741356082.mjs";
var routes = define_ROUTES_default;
var pages_dev_pipeline_default = {
  fetch(request, env, context) {
    const { pathname } = new URL(request.url);
    for (const exclude of routes.exclude) {
      if (isRoutingRuleMatch(pathname, exclude)) {
        return env.ASSETS.fetch(request);
      }
    }
    for (const include of routes.include) {
      if (isRoutingRuleMatch(pathname, include)) {
        const workerAsHandler = worker;
        if (workerAsHandler.fetch === void 0) {
          throw new TypeError("Entry point missing `fetch` handler");
        }
        return workerAsHandler.fetch(request, env, context);
      }
    }
    return env.ASSETS.fetch(request);
  }
};
export {
  pages_dev_pipeline_default as default
};
//# sourceMappingURL=t2t4l96ix6h.js.map
