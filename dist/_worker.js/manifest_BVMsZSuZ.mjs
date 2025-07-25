globalThis.process ??= {}; globalThis.process.env ??= {};
import { g as decodeKey } from './chunks/astro/server_BHnmQ_pU.mjs';
import './chunks/astro-designed-error-pages_CFFETS9y.mjs';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/noop-middleware_C4bEwikz.mjs';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///Users/kisha/serverless/scoreboard/","adapterName":"@astrojs/cloudflare","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/@astrojs/cloudflare/dist/entrypoints/image-endpoint.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"inline","value":"const p=e=>{if(!e)return\"\";const a={year:\"numeric\",month:\"long\",day:\"numeric\",timeZone:\"UTC\"};return new Date(e).toLocaleDateString(\"en-US\",a)},l=e=>e?e.charAt(0).toUpperCase()+e.slice(1).toLowerCase():\"\",u=e=>`\n    <div class=\"game-card\">\n      <div class=\"game-header\">\n        <span class=\"game-date\">${p(e.gameDate)}</span>\n        <span class=\"game-level\">${l(e.teams)}</span>\n      </div>\n      <div class=\"game-body\">\n        <div class=\"team\">\n          <span class=\"team-name\">${e.ehs}</span>\n          <span class=\"team-score\">${e.ehsFinal}</span>\n        </div>\n        <div class=\"team\">\n          <span class=\"team-name\">${e.opp}</span>\n          <span class=\"team-score\">${e.oppFinal}</span>\n        </div>\n      </div>\n    </div>\n  `;document.addEventListener(\"DOMContentLoaded\",()=>{const e=document.getElementById(\"filter-form\"),a=document.querySelector(\".scoreboard-container\");if(!e||!a){console.error(\"Filter form or scoreboard container not found!\");return}async function o(){const n=new FormData(e),t=new URLSearchParams,c=n.get(\"team\"),i=n.get(\"teams\"),m=n.get(\"gameDate\");c&&t.append(\"team\",c),i&&t.append(\"teams\",i),m&&t.append(\"gameDate\",m);const s=await(await fetch(`/api/games?${t.toString()}`)).json();if(s&&s.length>0){const d=s.map(u).join(\"\");a.innerHTML=`<div class=\"scoreboard-grid\">${d}</div>`}else a.innerHTML=\"<p>No games found matching your criteria.</p>\"}let r;e.addEventListener(\"input\",()=>{clearTimeout(r),r=window.setTimeout(o,300)}),e.addEventListener(\"reset\",()=>{setTimeout(o,0)})});\n"}],"styles":[{"type":"inline","content":":root{--navy-blue: #001f3f;--light-gray: #f4f4f4;--dark-gray: #333333;--border-color: #dddddd}html{font-family:system-ui,sans-serif;background-color:var(--light-gray)}body{margin:0;color:var(--dark-gray)}.scoreboard-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1.5rem}.game-card{background-color:#fff;border:1px solid var(--border-color);border-radius:8px;box-shadow:0 2px 4px #0000000d;overflow:hidden}.game-header{display:flex;justify-content:space-between;align-items:center;background-color:var(--light-gray);padding:.5rem 1rem;font-size:.9rem;color:var(--dark-gray);border-bottom:1px solid var(--border-color)}.game-level{font-weight:700}.game-body{display:flex;flex-direction:column;gap:.75rem;padding:1rem 1.5rem}.team{display:flex;justify-content:space-between;align-items:center;width:100%}.team-name{font-size:1.2rem;font-weight:600}.team-score{font-size:1.5rem;font-weight:700;color:var(--navy-blue)}.filter-container[data-astro-cid-egvsxq6h]{display:flex;flex-wrap:wrap;gap:1.5rem;padding:1.5rem;background-color:#fff;border-radius:8px;margin-top:2rem;margin-bottom:2rem;border:1px solid var(--border-color)}.filter-group[data-astro-cid-egvsxq6h]{display:flex;flex-direction:column;flex-grow:1}.filter-group[data-astro-cid-egvsxq6h] label[data-astro-cid-egvsxq6h]{margin-bottom:.5rem;font-size:.9rem;font-weight:500}.filter-group[data-astro-cid-egvsxq6h] input[data-astro-cid-egvsxq6h],.filter-group[data-astro-cid-egvsxq6h] select[data-astro-cid-egvsxq6h]{padding:.75rem;border:1px solid var(--border-color);border-radius:4px;font-size:1rem}.filter-group[data-astro-cid-egvsxq6h] button[data-astro-cid-egvsxq6h]{padding:.75rem;border:1px solid var(--border-color);border-radius:4px;font-size:1rem;background-color:var(--light-gray);cursor:pointer;align-self:flex-end;height:100%}main[data-astro-cid-j7pv25f6]{max-width:1200px;margin:auto;padding:1.5rem}header[data-astro-cid-j7pv25f6]{background-color:var(--navy-blue);color:#fff;padding:2rem 1.5rem;text-align:center;border-radius:0 0 8px 8px}h1[data-astro-cid-j7pv25f6]{margin:0;font-size:2.5rem}.scoreboard-container[data-astro-cid-j7pv25f6]{margin-top:2rem}\n"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/Users/kisha/serverless/scoreboard/src/pages/index.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(o,t)=>{let i=async()=>{await(await o())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var s=(i,t)=>{let a=async()=>{await(await i())()};if(t.value){let e=matchMedia(t.value);e.matches?a():e.addEventListener(\"change\",a,{once:!0})}};(self.Astro||(self.Astro={})).media=s;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var l=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let a of e)if(a.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=l;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000astro-internal:middleware":"_astro-internal_middleware.mjs","\u0000@astro-page:node_modules/@astrojs/cloudflare/dist/entrypoints/image-endpoint@_@js":"pages/_image.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"index.js","\u0000@astro-renderers":"renderers.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_BVMsZSuZ.mjs","/astro/hoisted.js?q=0":"_astro/hoisted.BPPTyzpU.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/_worker.js/_@astrojs-ssr-adapter.mjs","/_worker.js/_astro-internal_middleware.mjs","/_worker.js/index.js","/_worker.js/renderers.mjs","/_worker.js/chunks/_@astrojs-ssr-adapter_BDcuW39o.mjs","/_worker.js/chunks/astro-designed-error-pages_CFFETS9y.mjs","/_worker.js/chunks/astro_Dz12HNkY.mjs","/_worker.js/chunks/index_DITV6mYY.mjs","/_worker.js/chunks/noop-middleware_C4bEwikz.mjs","/_worker.js/pages/_image.astro.mjs","/_worker.js/pages/index.astro.mjs","/_worker.js/chunks/astro/env-setup_DUaZ-hTo.mjs","/_worker.js/chunks/astro/server_BHnmQ_pU.mjs"],"buildFormat":"directory","checkOrigin":false,"serverIslandNameMap":[],"key":"MVs/MNvmDd1pFfQYCmKIDEj1Rkoiu4GtpRKln+l9i14=","experimentalEnvGetSecretEnabled":false});

export { manifest };
