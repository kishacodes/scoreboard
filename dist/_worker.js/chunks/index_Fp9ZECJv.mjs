globalThis.process ??= {}; globalThis.process.env ??= {};
import { A as AstroError, i as i18nNoLocaleFoundInPath, R as ResponseSentError, f as MiddlewareNoDataOrNextCalled, g as MiddlewareNotAResponse, G as GetStaticPathsRequired, h as InvalidGetStaticPathsReturn, j as InvalidGetStaticPathsEntry, k as GetStaticPathsExpectedParams, l as GetStaticPathsInvalidRouteParam, P as PageNumberParamNotFound, m as NoMatchingStaticPathFound, n as PrerenderDynamicEndpointPathCollide, o as ReservedSlotName, p as RewriteWithBodyUsed, L as LocalsNotAnObject, q as PrerenderClientAddressNotAvailable, C as ClientAddressNotAvailable, S as StaticClientAddressNotAvailable, r as AstroResponseHeadersReassigned } from './astro/env-setup_DUaZ-hTo.mjs';
import { g as getActionQueryString, a as deserializeActionResult, D as DEFAULT_404_ROUTE } from './astro-designed-error-pages_2zR0lYYZ.mjs';
import { h as REROUTE_DIRECTIVE_HEADER, D as DEFAULT_404_COMPONENT, u as renderSlotToString, v as renderJSX, w as chunkToString, x as isRenderInstruction, z as originPathnameSymbol, R as ROUTE_TYPE_HEADER, A as ASTRO_VERSION, p as clientLocalsSymbol, q as clientAddressSymbol, t as responseSentSymbol$1, B as renderPage, C as REWRITE_DIRECTIVE_HEADER_KEY, E as REWRITE_DIRECTIVE_HEADER_VALUE, F as renderEndpoint } from './astro/server_DDu7V7oX.mjs';

const ACTION_API_CONTEXT_SYMBOL = Symbol.for("astro.actionAPIContext");

function hasActionPayload(locals) {
  return "_actionPayload" in locals;
}
function createGetActionResult(locals) {
  return (actionFn) => {
    if (!hasActionPayload(locals) || actionFn.toString() !== getActionQueryString(locals._actionPayload.actionName)) {
      return void 0;
    }
    return deserializeActionResult(locals._actionPayload.actionResult);
  };
}
function createCallAction(context) {
  return (baseAction, input) => {
    Reflect.set(context, ACTION_API_CONTEXT_SYMBOL, true);
    const action = baseAction.bind(context);
    return action(input);
  };
}

function appendForwardSlash(path) {
  return path.endsWith("/") ? path : path + "/";
}
function prependForwardSlash(path) {
  return path[0] === "/" ? path : "/" + path;
}
function removeTrailingForwardSlash(path) {
  return path.endsWith("/") ? path.slice(0, path.length - 1) : path;
}
function removeLeadingForwardSlash(path) {
  return path.startsWith("/") ? path.substring(1) : path;
}
function trimSlashes(path) {
  return path.replace(/^\/|\/$/g, "");
}
function isString(path) {
  return typeof path === "string" || path instanceof String;
}
function joinPaths(...paths) {
  return paths.filter(isString).map((path, i) => {
    if (i === 0) {
      return removeTrailingForwardSlash(path);
    } else if (i === paths.length - 1) {
      return removeLeadingForwardSlash(path);
    } else {
      return trimSlashes(path);
    }
  }).join("/");
}
function slash(path) {
  return path.replace(/\\/g, "/");
}
function fileExtension(path) {
  const ext = path.split(".").pop();
  return ext !== path ? `.${ext}` : "";
}

function shouldAppendForwardSlash(trailingSlash, buildFormat) {
  switch (trailingSlash) {
    case "always":
      return true;
    case "never":
      return false;
    case "ignore": {
      switch (buildFormat) {
        case "directory":
          return true;
        case "preserve":
        case "file":
          return false;
      }
    }
  }
}

function requestHasLocale(locales) {
  return function(context) {
    return pathHasLocale(context.url.pathname, locales);
  };
}
function requestIs404Or500(request, base = "") {
  const url = new URL(request.url);
  return url.pathname.startsWith(`${base}/404`) || url.pathname.startsWith(`${base}/500`);
}
function pathHasLocale(path, locales) {
  const segments = path.split("/");
  for (const segment of segments) {
    for (const locale of locales) {
      if (typeof locale === "string") {
        if (normalizeTheLocale(segment) === normalizeTheLocale(locale)) {
          return true;
        }
      } else if (segment === locale.path) {
        return true;
      }
    }
  }
  return false;
}
function getPathByLocale(locale, locales) {
  for (const loopLocale of locales) {
    if (typeof loopLocale === "string") {
      if (loopLocale === locale) {
        return loopLocale;
      }
    } else {
      for (const code of loopLocale.codes) {
        if (code === locale) {
          return loopLocale.path;
        }
      }
    }
  }
  throw new AstroError(i18nNoLocaleFoundInPath);
}
function normalizeTheLocale(locale) {
  return locale.replaceAll("_", "-").toLowerCase();
}
function toCodes(locales) {
  return locales.map((loopLocale) => {
    if (typeof loopLocale === "string") {
      return loopLocale;
    } else {
      return loopLocale.codes[0];
    }
  });
}
function redirectToDefaultLocale({
  trailingSlash,
  format,
  base,
  defaultLocale
}) {
  return function(context, statusCode) {
    if (shouldAppendForwardSlash(trailingSlash, format)) {
      return context.redirect(`${appendForwardSlash(joinPaths(base, defaultLocale))}`, statusCode);
    } else {
      return context.redirect(`${joinPaths(base, defaultLocale)}`, statusCode);
    }
  };
}
function notFound({ base, locales }) {
  return function(context, response) {
    if (response?.headers.get(REROUTE_DIRECTIVE_HEADER) === "no") return response;
    const url = context.url;
    const isRoot = url.pathname === base + "/" || url.pathname === base;
    if (!(isRoot || pathHasLocale(url.pathname, locales))) {
      if (response) {
        response.headers.set(REROUTE_DIRECTIVE_HEADER, "no");
        return new Response(response.body, {
          status: 404,
          headers: response.headers
        });
      } else {
        return new Response(null, {
          status: 404,
          headers: {
            [REROUTE_DIRECTIVE_HEADER]: "no"
          }
        });
      }
    }
    return void 0;
  };
}
function redirectToFallback({
  fallback,
  locales,
  defaultLocale,
  strategy,
  base,
  fallbackType
}) {
  return async function(context, response) {
    if (response.status >= 300 && fallback) {
      const fallbackKeys = fallback ? Object.keys(fallback) : [];
      const segments = context.url.pathname.split("/");
      const urlLocale = segments.find((segment) => {
        for (const locale of locales) {
          if (typeof locale === "string") {
            if (locale === segment) {
              return true;
            }
          } else if (locale.path === segment) {
            return true;
          }
        }
        return false;
      });
      if (urlLocale && fallbackKeys.includes(urlLocale)) {
        const fallbackLocale = fallback[urlLocale];
        const pathFallbackLocale = getPathByLocale(fallbackLocale, locales);
        let newPathname;
        if (pathFallbackLocale === defaultLocale && strategy === "pathname-prefix-other-locales") {
          if (context.url.pathname.includes(`${base}`)) {
            newPathname = context.url.pathname.replace(`/${urlLocale}`, ``);
          } else {
            newPathname = context.url.pathname.replace(`/${urlLocale}`, `/`);
          }
        } else {
          newPathname = context.url.pathname.replace(`/${urlLocale}`, `/${pathFallbackLocale}`);
        }
        if (fallbackType === "rewrite") {
          return await context.rewrite(newPathname);
        } else {
          return context.redirect(newPathname);
        }
      }
    }
    return response;
  };
}

function parseLocale(header) {
  if (header === "*") {
    return [{ locale: header, qualityValue: void 0 }];
  }
  const result = [];
  const localeValues = header.split(",").map((str) => str.trim());
  for (const localeValue of localeValues) {
    const split = localeValue.split(";").map((str) => str.trim());
    const localeName = split[0];
    const qualityValue = split[1];
    if (!split) {
      continue;
    }
    if (qualityValue && qualityValue.startsWith("q=")) {
      const qualityValueAsFloat = Number.parseFloat(qualityValue.slice("q=".length));
      if (Number.isNaN(qualityValueAsFloat) || qualityValueAsFloat > 1) {
        result.push({
          locale: localeName,
          qualityValue: void 0
        });
      } else {
        result.push({
          locale: localeName,
          qualityValue: qualityValueAsFloat
        });
      }
    } else {
      result.push({
        locale: localeName,
        qualityValue: void 0
      });
    }
  }
  return result;
}
function sortAndFilterLocales(browserLocaleList, locales) {
  const normalizedLocales = toCodes(locales).map(normalizeTheLocale);
  return browserLocaleList.filter((browserLocale) => {
    if (browserLocale.locale !== "*") {
      return normalizedLocales.includes(normalizeTheLocale(browserLocale.locale));
    }
    return true;
  }).sort((a, b) => {
    if (a.qualityValue && b.qualityValue) {
      return Math.sign(b.qualityValue - a.qualityValue);
    }
    return 0;
  });
}
function computePreferredLocale(request, locales) {
  const acceptHeader = request.headers.get("Accept-Language");
  let result = void 0;
  if (acceptHeader) {
    const browserLocaleList = sortAndFilterLocales(parseLocale(acceptHeader), locales);
    const firstResult = browserLocaleList.at(0);
    if (firstResult && firstResult.locale !== "*") {
      for (const currentLocale of locales) {
        if (typeof currentLocale === "string") {
          if (normalizeTheLocale(currentLocale) === normalizeTheLocale(firstResult.locale)) {
            result = currentLocale;
          }
        } else {
          for (const currentCode of currentLocale.codes) {
            if (normalizeTheLocale(currentCode) === normalizeTheLocale(firstResult.locale)) {
              result = currentLocale.path;
            }
          }
        }
      }
    }
  }
  return result;
}
function computePreferredLocaleList(request, locales) {
  const acceptHeader = request.headers.get("Accept-Language");
  let result = [];
  if (acceptHeader) {
    const browserLocaleList = sortAndFilterLocales(parseLocale(acceptHeader), locales);
    if (browserLocaleList.length === 1 && browserLocaleList.at(0).locale === "*") {
      return locales.map((locale) => {
        if (typeof locale === "string") {
          return locale;
        } else {
          return locale.codes.at(0);
        }
      });
    } else if (browserLocaleList.length > 0) {
      for (const browserLocale of browserLocaleList) {
        for (const loopLocale of locales) {
          if (typeof loopLocale === "string") {
            if (normalizeTheLocale(loopLocale) === normalizeTheLocale(browserLocale.locale)) {
              result.push(loopLocale);
            }
          } else {
            for (const code of loopLocale.codes) {
              if (code === browserLocale.locale) {
                result.push(loopLocale.path);
              }
            }
          }
        }
      }
    }
  }
  return result;
}
function computeCurrentLocale(pathname, locales, defaultLocale) {
  for (const segment of pathname.split("/")) {
    for (const locale of locales) {
      if (typeof locale === "string") {
        if (!segment.includes(locale)) continue;
        if (normalizeTheLocale(locale) === normalizeTheLocale(segment)) {
          return locale;
        }
      } else {
        if (locale.path === segment) {
          return locale.codes.at(0);
        } else {
          for (const code of locale.codes) {
            if (normalizeTheLocale(code) === normalizeTheLocale(segment)) {
              return code;
            }
          }
        }
      }
    }
  }
  for (const locale of locales) {
    if (typeof locale === "string") {
      if (locale === defaultLocale) {
        return locale;
      }
    } else {
      if (locale.path === defaultLocale) {
        return locale.codes.at(0);
      }
    }
  }
}

/*!
 * cookie
 * Copyright(c) 2012-2014 Roman Shtylman
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */

/**
 * Module exports.
 * @public
 */

var parse_1 = parse;
var serialize_1 = serialize;

/**
 * Module variables.
 * @private
 */

var __toString = Object.prototype.toString;
var __hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * RegExp to match cookie-name in RFC 6265 sec 4.1.1
 * This refers out to the obsoleted definition of token in RFC 2616 sec 2.2
 * which has been replaced by the token definition in RFC 7230 appendix B.
 *
 * cookie-name       = token
 * token             = 1*tchar
 * tchar             = "!" / "#" / "$" / "%" / "&" / "'" /
 *                     "*" / "+" / "-" / "." / "^" / "_" /
 *                     "`" / "|" / "~" / DIGIT / ALPHA
 */

var cookieNameRegExp = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/;

/**
 * RegExp to match cookie-value in RFC 6265 sec 4.1.1
 *
 * cookie-value      = *cookie-octet / ( DQUOTE *cookie-octet DQUOTE )
 * cookie-octet      = %x21 / %x23-2B / %x2D-3A / %x3C-5B / %x5D-7E
 *                     ; US-ASCII characters excluding CTLs,
 *                     ; whitespace DQUOTE, comma, semicolon,
 *                     ; and backslash
 */

var cookieValueRegExp = /^("?)[\u0021\u0023-\u002B\u002D-\u003A\u003C-\u005B\u005D-\u007E]*\1$/;

/**
 * RegExp to match domain-value in RFC 6265 sec 4.1.1
 *
 * domain-value      = <subdomain>
 *                     ; defined in [RFC1034], Section 3.5, as
 *                     ; enhanced by [RFC1123], Section 2.1
 * <subdomain>       = <label> | <subdomain> "." <label>
 * <label>           = <let-dig> [ [ <ldh-str> ] <let-dig> ]
 *                     Labels must be 63 characters or less.
 *                     'let-dig' not 'letter' in the first char, per RFC1123
 * <ldh-str>         = <let-dig-hyp> | <let-dig-hyp> <ldh-str>
 * <let-dig-hyp>     = <let-dig> | "-"
 * <let-dig>         = <letter> | <digit>
 * <letter>          = any one of the 52 alphabetic characters A through Z in
 *                     upper case and a through z in lower case
 * <digit>           = any one of the ten digits 0 through 9
 *
 * Keep support for leading dot: https://github.com/jshttp/cookie/issues/173
 *
 * > (Note that a leading %x2E ("."), if present, is ignored even though that
 * character is not permitted, but a trailing %x2E ("."), if present, will
 * cause the user agent to ignore the attribute.)
 */

var domainValueRegExp = /^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i;

/**
 * RegExp to match path-value in RFC 6265 sec 4.1.1
 *
 * path-value        = <any CHAR except CTLs or ";">
 * CHAR              = %x01-7F
 *                     ; defined in RFC 5234 appendix B.1
 */

var pathValueRegExp = /^[\u0020-\u003A\u003D-\u007E]*$/;

/**
 * Parse a cookie header.
 *
 * Parse the given cookie header string into an object
 * The object has the various cookies as keys(names) => values
 *
 * @param {string} str
 * @param {object} [opt]
 * @return {object}
 * @public
 */

function parse(str, opt) {
  if (typeof str !== 'string') {
    throw new TypeError('argument str must be a string');
  }

  var obj = {};
  var len = str.length;
  // RFC 6265 sec 4.1.1, RFC 2616 2.2 defines a cookie name consists of one char minimum, plus '='.
  if (len < 2) return obj;

  var dec = (opt && opt.decode) || decode;
  var index = 0;
  var eqIdx = 0;
  var endIdx = 0;

  do {
    eqIdx = str.indexOf('=', index);
    if (eqIdx === -1) break; // No more cookie pairs.

    endIdx = str.indexOf(';', index);

    if (endIdx === -1) {
      endIdx = len;
    } else if (eqIdx > endIdx) {
      // backtrack on prior semicolon
      index = str.lastIndexOf(';', eqIdx - 1) + 1;
      continue;
    }

    var keyStartIdx = startIndex(str, index, eqIdx);
    var keyEndIdx = endIndex(str, eqIdx, keyStartIdx);
    var key = str.slice(keyStartIdx, keyEndIdx);

    // only assign once
    if (!__hasOwnProperty.call(obj, key)) {
      var valStartIdx = startIndex(str, eqIdx + 1, endIdx);
      var valEndIdx = endIndex(str, endIdx, valStartIdx);

      if (str.charCodeAt(valStartIdx) === 0x22 /* " */ && str.charCodeAt(valEndIdx - 1) === 0x22 /* " */) {
        valStartIdx++;
        valEndIdx--;
      }

      var val = str.slice(valStartIdx, valEndIdx);
      obj[key] = tryDecode(val, dec);
    }

    index = endIdx + 1;
  } while (index < len);

  return obj;
}

function startIndex(str, index, max) {
  do {
    var code = str.charCodeAt(index);
    if (code !== 0x20 /*   */ && code !== 0x09 /* \t */) return index;
  } while (++index < max);
  return max;
}

function endIndex(str, index, min) {
  while (index > min) {
    var code = str.charCodeAt(--index);
    if (code !== 0x20 /*   */ && code !== 0x09 /* \t */) return index + 1;
  }
  return min;
}

/**
 * Serialize data into a cookie header.
 *
 * Serialize a name value pair into a cookie string suitable for
 * http headers. An optional options object specifies cookie parameters.
 *
 * serialize('foo', 'bar', { httpOnly: true })
 *   => "foo=bar; httpOnly"
 *
 * @param {string} name
 * @param {string} val
 * @param {object} [opt]
 * @return {string}
 * @public
 */

function serialize(name, val, opt) {
  var enc = (opt && opt.encode) || encodeURIComponent;

  if (typeof enc !== 'function') {
    throw new TypeError('option encode is invalid');
  }

  if (!cookieNameRegExp.test(name)) {
    throw new TypeError('argument name is invalid');
  }

  var value = enc(val);

  if (!cookieValueRegExp.test(value)) {
    throw new TypeError('argument val is invalid');
  }

  var str = name + '=' + value;
  if (!opt) return str;

  if (null != opt.maxAge) {
    var maxAge = Math.floor(opt.maxAge);

    if (!isFinite(maxAge)) {
      throw new TypeError('option maxAge is invalid')
    }

    str += '; Max-Age=' + maxAge;
  }

  if (opt.domain) {
    if (!domainValueRegExp.test(opt.domain)) {
      throw new TypeError('option domain is invalid');
    }

    str += '; Domain=' + opt.domain;
  }

  if (opt.path) {
    if (!pathValueRegExp.test(opt.path)) {
      throw new TypeError('option path is invalid');
    }

    str += '; Path=' + opt.path;
  }

  if (opt.expires) {
    var expires = opt.expires;

    if (!isDate(expires) || isNaN(expires.valueOf())) {
      throw new TypeError('option expires is invalid');
    }

    str += '; Expires=' + expires.toUTCString();
  }

  if (opt.httpOnly) {
    str += '; HttpOnly';
  }

  if (opt.secure) {
    str += '; Secure';
  }

  if (opt.partitioned) {
    str += '; Partitioned';
  }

  if (opt.priority) {
    var priority = typeof opt.priority === 'string'
      ? opt.priority.toLowerCase() : opt.priority;

    switch (priority) {
      case 'low':
        str += '; Priority=Low';
        break
      case 'medium':
        str += '; Priority=Medium';
        break
      case 'high':
        str += '; Priority=High';
        break
      default:
        throw new TypeError('option priority is invalid')
    }
  }

  if (opt.sameSite) {
    var sameSite = typeof opt.sameSite === 'string'
      ? opt.sameSite.toLowerCase() : opt.sameSite;

    switch (sameSite) {
      case true:
        str += '; SameSite=Strict';
        break;
      case 'lax':
        str += '; SameSite=Lax';
        break;
      case 'strict':
        str += '; SameSite=Strict';
        break;
      case 'none':
        str += '; SameSite=None';
        break;
      default:
        throw new TypeError('option sameSite is invalid');
    }
  }

  return str;
}

/**
 * URL-decode string value. Optimized to skip native call when no %.
 *
 * @param {string} str
 * @returns {string}
 */

function decode (str) {
  return str.indexOf('%') !== -1
    ? decodeURIComponent(str)
    : str
}

/**
 * Determine if value is a Date.
 *
 * @param {*} val
 * @private
 */

function isDate (val) {
  return __toString.call(val) === '[object Date]';
}

/**
 * Try decoding a string using a decoding function.
 *
 * @param {string} str
 * @param {function} decode
 * @private
 */

function tryDecode(str, decode) {
  try {
    return decode(str);
  } catch (e) {
    return str;
  }
}

const DELETED_EXPIRATION = /* @__PURE__ */ new Date(0);
const DELETED_VALUE = "deleted";
const responseSentSymbol = Symbol.for("astro.responseSent");
class AstroCookie {
  constructor(value) {
    this.value = value;
  }
  json() {
    if (this.value === void 0) {
      throw new Error(`Cannot convert undefined to an object.`);
    }
    return JSON.parse(this.value);
  }
  number() {
    return Number(this.value);
  }
  boolean() {
    if (this.value === "false") return false;
    if (this.value === "0") return false;
    return Boolean(this.value);
  }
}
class AstroCookies {
  #request;
  #requestValues;
  #outgoing;
  #consumed;
  constructor(request) {
    this.#request = request;
    this.#requestValues = null;
    this.#outgoing = null;
    this.#consumed = false;
  }
  /**
   * Astro.cookies.delete(key) is used to delete a cookie. Using this method will result
   * in a Set-Cookie header added to the response.
   * @param key The cookie to delete
   * @param options Options related to this deletion, such as the path of the cookie.
   */
  delete(key, options) {
    const {
      // @ts-expect-error
      maxAge: _ignoredMaxAge,
      // @ts-expect-error
      expires: _ignoredExpires,
      ...sanitizedOptions
    } = options || {};
    const serializeOptions = {
      expires: DELETED_EXPIRATION,
      ...sanitizedOptions
    };
    this.#ensureOutgoingMap().set(key, [
      DELETED_VALUE,
      serialize_1(key, DELETED_VALUE, serializeOptions),
      false
    ]);
  }
  /**
   * Astro.cookies.get(key) is used to get a cookie value. The cookie value is read from the
   * request. If you have set a cookie via Astro.cookies.set(key, value), the value will be taken
   * from that set call, overriding any values already part of the request.
   * @param key The cookie to get.
   * @returns An object containing the cookie value as well as convenience methods for converting its value.
   */
  get(key, options = void 0) {
    if (this.#outgoing?.has(key)) {
      let [serializedValue, , isSetValue] = this.#outgoing.get(key);
      if (isSetValue) {
        return new AstroCookie(serializedValue);
      } else {
        return void 0;
      }
    }
    const values = this.#ensureParsed(options);
    if (key in values) {
      const value = values[key];
      return new AstroCookie(value);
    }
  }
  /**
   * Astro.cookies.has(key) returns a boolean indicating whether this cookie is either
   * part of the initial request or set via Astro.cookies.set(key)
   * @param key The cookie to check for.
   * @returns
   */
  has(key, options = void 0) {
    if (this.#outgoing?.has(key)) {
      let [, , isSetValue] = this.#outgoing.get(key);
      return isSetValue;
    }
    const values = this.#ensureParsed(options);
    return !!values[key];
  }
  /**
   * Astro.cookies.set(key, value) is used to set a cookie's value. If provided
   * an object it will be stringified via JSON.stringify(value). Additionally you
   * can provide options customizing how this cookie will be set, such as setting httpOnly
   * in order to prevent the cookie from being read in client-side JavaScript.
   * @param key The name of the cookie to set.
   * @param value A value, either a string or other primitive or an object.
   * @param options Options for the cookie, such as the path and security settings.
   */
  set(key, value, options) {
    if (this.#consumed) {
      const warning = new Error(
        "Astro.cookies.set() was called after the cookies had already been sent to the browser.\nThis may have happened if this method was called in an imported component.\nPlease make sure that Astro.cookies.set() is only called in the frontmatter of the main page."
      );
      warning.name = "Warning";
      console.warn(warning);
    }
    let serializedValue;
    if (typeof value === "string") {
      serializedValue = value;
    } else {
      let toStringValue = value.toString();
      if (toStringValue === Object.prototype.toString.call(value)) {
        serializedValue = JSON.stringify(value);
      } else {
        serializedValue = toStringValue;
      }
    }
    const serializeOptions = {};
    if (options) {
      Object.assign(serializeOptions, options);
    }
    this.#ensureOutgoingMap().set(key, [
      serializedValue,
      serialize_1(key, serializedValue, serializeOptions),
      true
    ]);
    if (this.#request[responseSentSymbol]) {
      throw new AstroError({
        ...ResponseSentError
      });
    }
  }
  /**
   * Merges a new AstroCookies instance into the current instance. Any new cookies
   * will be added to the current instance, overwriting any existing cookies with the same name.
   */
  merge(cookies) {
    const outgoing = cookies.#outgoing;
    if (outgoing) {
      for (const [key, value] of outgoing) {
        this.#ensureOutgoingMap().set(key, value);
      }
    }
  }
  /**
   * Astro.cookies.header() returns an iterator for the cookies that have previously
   * been set by either Astro.cookies.set() or Astro.cookies.delete().
   * This method is primarily used by adapters to set the header on outgoing responses.
   * @returns
   */
  *headers() {
    if (this.#outgoing == null) return;
    for (const [, value] of this.#outgoing) {
      yield value[1];
    }
  }
  /**
   * Behaves the same as AstroCookies.prototype.headers(),
   * but allows a warning when cookies are set after the instance is consumed.
   */
  static consume(cookies) {
    cookies.#consumed = true;
    return cookies.headers();
  }
  #ensureParsed(options = void 0) {
    if (!this.#requestValues) {
      this.#parse(options);
    }
    if (!this.#requestValues) {
      this.#requestValues = {};
    }
    return this.#requestValues;
  }
  #ensureOutgoingMap() {
    if (!this.#outgoing) {
      this.#outgoing = /* @__PURE__ */ new Map();
    }
    return this.#outgoing;
  }
  #parse(options = void 0) {
    const raw = this.#request.headers.get("cookie");
    if (!raw) {
      return;
    }
    this.#requestValues = parse_1(raw, options);
  }
}

const astroCookiesSymbol = Symbol.for("astro.cookies");
function attachCookiesToResponse(response, cookies) {
  Reflect.set(response, astroCookiesSymbol, cookies);
}
function getCookiesFromResponse(response) {
  let cookies = Reflect.get(response, astroCookiesSymbol);
  if (cookies != null) {
    return cookies;
  } else {
    return void 0;
  }
}
function* getSetCookiesFromResponse(response) {
  const cookies = getCookiesFromResponse(response);
  if (!cookies) {
    return [];
  }
  for (const headerValue of AstroCookies.consume(cookies)) {
    yield headerValue;
  }
  return [];
}

async function callMiddleware(onRequest, apiContext, responseFunction) {
  let nextCalled = false;
  let responseFunctionPromise = void 0;
  const next = async (payload) => {
    nextCalled = true;
    responseFunctionPromise = responseFunction(apiContext, payload);
    return responseFunctionPromise;
  };
  let middlewarePromise = onRequest(apiContext, next);
  return await Promise.resolve(middlewarePromise).then(async (value) => {
    if (nextCalled) {
      if (typeof value !== "undefined") {
        if (value instanceof Response === false) {
          throw new AstroError(MiddlewareNotAResponse);
        }
        return value;
      } else {
        if (responseFunctionPromise) {
          return responseFunctionPromise;
        } else {
          throw new AstroError(MiddlewareNotAResponse);
        }
      }
    } else if (typeof value === "undefined") {
      throw new AstroError(MiddlewareNoDataOrNextCalled);
    } else if (value instanceof Response === false) {
      throw new AstroError(MiddlewareNotAResponse);
    } else {
      return value;
    }
  });
}

async function renderRedirect(renderContext) {
  const {
    request: { method },
    routeData
  } = renderContext;
  const { redirect, redirectRoute } = routeData;
  const status = redirectRoute && typeof redirect === "object" ? redirect.status : method === "GET" ? 301 : 308;
  const headers = { location: encodeURI(redirectRouteGenerate(renderContext)) };
  return new Response(null, { status, headers });
}
function redirectRouteGenerate(renderContext) {
  const {
    params,
    routeData: { redirect, redirectRoute }
  } = renderContext;
  if (typeof redirectRoute !== "undefined") {
    return redirectRoute?.generate(params) || redirectRoute?.pathname || "/";
  } else if (typeof redirect === "string") {
    let target = redirect;
    for (const param of Object.keys(params)) {
      const paramValue = params[param];
      target = target.replace(`[${param}]`, paramValue).replace(`[...${param}]`, paramValue);
    }
    return target;
  } else if (typeof redirect === "undefined") {
    return "/";
  }
  return redirect.destination;
}

const VALID_PARAM_TYPES = ["string", "number", "undefined"];
function validateGetStaticPathsParameter([key, value], route) {
  if (!VALID_PARAM_TYPES.includes(typeof value)) {
    throw new AstroError({
      ...GetStaticPathsInvalidRouteParam,
      message: GetStaticPathsInvalidRouteParam.message(key, value, typeof value),
      location: {
        file: route
      }
    });
  }
}
function validateDynamicRouteModule(mod, {
  ssr,
  route
}) {
  if ((!ssr || route.prerender) && !mod.getStaticPaths) {
    throw new AstroError({
      ...GetStaticPathsRequired,
      location: { file: route.component }
    });
  }
}
function validateGetStaticPathsResult(result, logger, route) {
  if (!Array.isArray(result)) {
    throw new AstroError({
      ...InvalidGetStaticPathsReturn,
      message: InvalidGetStaticPathsReturn.message(typeof result),
      location: {
        file: route.component
      }
    });
  }
  result.forEach((pathObject) => {
    if (typeof pathObject === "object" && Array.isArray(pathObject) || pathObject === null) {
      throw new AstroError({
        ...InvalidGetStaticPathsEntry,
        message: InvalidGetStaticPathsEntry.message(
          Array.isArray(pathObject) ? "array" : typeof pathObject
        )
      });
    }
    if (pathObject.params === void 0 || pathObject.params === null || pathObject.params && Object.keys(pathObject.params).length === 0) {
      throw new AstroError({
        ...GetStaticPathsExpectedParams,
        location: {
          file: route.component
        }
      });
    }
    for (const [key, val] of Object.entries(pathObject.params)) {
      if (!(typeof val === "undefined" || typeof val === "string" || typeof val === "number")) {
        logger.warn(
          "router",
          `getStaticPaths() returned an invalid path param: "${key}". A string, number or undefined value was expected, but got \`${JSON.stringify(
            val
          )}\`.`
        );
      }
      if (typeof val === "string" && val === "") {
        logger.warn(
          "router",
          `getStaticPaths() returned an invalid path param: "${key}". \`undefined\` expected for an optional param, but got empty string.`
        );
      }
    }
  });
}

function stringifyParams(params, route) {
  const validatedParams = Object.entries(params).reduce((acc, next) => {
    validateGetStaticPathsParameter(next, route.component);
    const [key, value] = next;
    if (value !== void 0) {
      acc[key] = typeof value === "string" ? trimSlashes(value) : value.toString();
    }
    return acc;
  }, {});
  return route.generate(validatedParams);
}

function generatePaginateFunction(routeMatch) {
  return function paginateUtility(data, args = {}) {
    let { pageSize: _pageSize, params: _params, props: _props } = args;
    const pageSize = _pageSize || 10;
    const paramName = "page";
    const additionalParams = _params || {};
    const additionalProps = _props || {};
    let includesFirstPageNumber;
    if (routeMatch.params.includes(`...${paramName}`)) {
      includesFirstPageNumber = false;
    } else if (routeMatch.params.includes(`${paramName}`)) {
      includesFirstPageNumber = true;
    } else {
      throw new AstroError({
        ...PageNumberParamNotFound,
        message: PageNumberParamNotFound.message(paramName)
      });
    }
    const lastPage = Math.max(1, Math.ceil(data.length / pageSize));
    const result = [...Array(lastPage).keys()].map((num) => {
      const pageNum = num + 1;
      const start = pageSize === Infinity ? 0 : (pageNum - 1) * pageSize;
      const end = Math.min(start + pageSize, data.length);
      const params = {
        ...additionalParams,
        [paramName]: includesFirstPageNumber || pageNum > 1 ? String(pageNum) : void 0
      };
      const current = correctIndexRoute(routeMatch.generate({ ...params }));
      const next = pageNum === lastPage ? void 0 : correctIndexRoute(routeMatch.generate({ ...params, page: String(pageNum + 1) }));
      const prev = pageNum === 1 ? void 0 : correctIndexRoute(
        routeMatch.generate({
          ...params,
          page: !includesFirstPageNumber && pageNum - 1 === 1 ? void 0 : String(pageNum - 1)
        })
      );
      const first = pageNum === 1 ? void 0 : correctIndexRoute(
        routeMatch.generate({
          ...params,
          page: includesFirstPageNumber ? "1" : void 0
        })
      );
      const last = pageNum === lastPage ? void 0 : correctIndexRoute(routeMatch.generate({ ...params, page: String(lastPage) }));
      return {
        params,
        props: {
          ...additionalProps,
          page: {
            data: data.slice(start, end),
            start,
            end: end - 1,
            size: pageSize,
            total: data.length,
            currentPage: pageNum,
            lastPage,
            url: { current, next, prev, first, last }
          }
        }
      };
    });
    return result;
  };
}
function correctIndexRoute(route) {
  if (route === "") {
    return "/";
  }
  return route;
}

async function callGetStaticPaths({
  mod,
  route,
  routeCache,
  logger,
  ssr
}) {
  const cached = routeCache.get(route);
  if (!mod) {
    throw new Error("This is an error caused by Astro and not your code. Please file an issue.");
  }
  if (cached?.staticPaths) {
    return cached.staticPaths;
  }
  validateDynamicRouteModule(mod, { ssr, route });
  if (ssr && !route.prerender) {
    const entry = Object.assign([], { keyed: /* @__PURE__ */ new Map() });
    routeCache.set(route, { ...cached, staticPaths: entry });
    return entry;
  }
  let staticPaths = [];
  if (!mod.getStaticPaths) {
    throw new Error("Unexpected Error.");
  }
  staticPaths = await mod.getStaticPaths({
    // Q: Why the cast?
    // A: So users downstream can have nicer typings, we have to make some sacrifice in our internal typings, which necessitate a cast here
    paginate: generatePaginateFunction(route)
  });
  validateGetStaticPathsResult(staticPaths, logger, route);
  const keyedStaticPaths = staticPaths;
  keyedStaticPaths.keyed = /* @__PURE__ */ new Map();
  for (const sp of keyedStaticPaths) {
    const paramsKey = stringifyParams(sp.params, route);
    keyedStaticPaths.keyed.set(paramsKey, sp);
  }
  routeCache.set(route, { ...cached, staticPaths: keyedStaticPaths });
  return keyedStaticPaths;
}
class RouteCache {
  logger;
  cache = {};
  mode;
  constructor(logger, mode = "production") {
    this.logger = logger;
    this.mode = mode;
  }
  /** Clear the cache. */
  clearAll() {
    this.cache = {};
  }
  set(route, entry) {
    const key = this.key(route);
    if (this.mode === "production" && this.cache[key]?.staticPaths) {
      this.logger.warn(null, `Internal Warning: route cache overwritten. (${key})`);
    }
    this.cache[key] = entry;
  }
  get(route) {
    return this.cache[this.key(route)];
  }
  key(route) {
    return `${route.route}_${route.component}`;
  }
}
function findPathItemByKey(staticPaths, params, route, logger) {
  const paramsKey = stringifyParams(params, route);
  const matchedStaticPath = staticPaths.keyed.get(paramsKey);
  if (matchedStaticPath) {
    return matchedStaticPath;
  }
  logger.debug("router", `findPathItemByKey() - Unexpected cache miss looking for ${paramsKey}`);
}

function routeIsRedirect(route) {
  return route?.type === "redirect";
}
function routeIsFallback(route) {
  return route?.type === "fallback";
}

async function getProps(opts) {
  const { logger, mod, routeData: route, routeCache, pathname, serverLike } = opts;
  if (!route || route.pathname) {
    return {};
  }
  if (routeIsRedirect(route) || routeIsFallback(route) || route.component === DEFAULT_404_COMPONENT) {
    return {};
  }
  const staticPaths = await callGetStaticPaths({
    mod,
    route,
    routeCache,
    logger,
    ssr: serverLike
  });
  const params = getParams(route, pathname);
  const matchedStaticPath = findPathItemByKey(staticPaths, params, route, logger);
  if (!matchedStaticPath && (serverLike ? route.prerender : true)) {
    throw new AstroError({
      ...NoMatchingStaticPathFound,
      message: NoMatchingStaticPathFound.message(pathname),
      hint: NoMatchingStaticPathFound.hint([route.component])
    });
  }
  if (mod) {
    validatePrerenderEndpointCollision(route, mod, params);
  }
  const props = matchedStaticPath?.props ? { ...matchedStaticPath.props } : {};
  return props;
}
function getParams(route, pathname) {
  if (!route.params.length) return {};
  const paramsMatch = route.pattern.exec(decodeURIComponent(pathname));
  if (!paramsMatch) return {};
  const params = {};
  route.params.forEach((key, i) => {
    if (key.startsWith("...")) {
      params[key.slice(3)] = paramsMatch[i + 1] ? paramsMatch[i + 1] : void 0;
    } else {
      params[key] = paramsMatch[i + 1];
    }
  });
  return params;
}
function validatePrerenderEndpointCollision(route, mod, params) {
  if (route.type === "endpoint" && mod.getStaticPaths) {
    const lastSegment = route.segments[route.segments.length - 1];
    const paramValues = Object.values(params);
    const lastParam = paramValues[paramValues.length - 1];
    if (lastSegment.length === 1 && lastSegment[0].dynamic && lastParam === void 0) {
      throw new AstroError({
        ...PrerenderDynamicEndpointPathCollide,
        message: PrerenderDynamicEndpointPathCollide.message(route.route),
        hint: PrerenderDynamicEndpointPathCollide.hint(route.component),
        location: {
          file: route.component
        }
      });
    }
  }
}

function getFunctionExpression(slot) {
  if (!slot) return;
  const expressions = slot?.expressions?.filter((e) => isRenderInstruction(e) === false);
  if (expressions?.length !== 1) return;
  return expressions[0];
}
class Slots {
  #result;
  #slots;
  #logger;
  constructor(result, slots, logger) {
    this.#result = result;
    this.#slots = slots;
    this.#logger = logger;
    if (slots) {
      for (const key of Object.keys(slots)) {
        if (this[key] !== void 0) {
          throw new AstroError({
            ...ReservedSlotName,
            message: ReservedSlotName.message(key)
          });
        }
        Object.defineProperty(this, key, {
          get() {
            return true;
          },
          enumerable: true
        });
      }
    }
  }
  has(name) {
    if (!this.#slots) return false;
    return Boolean(this.#slots[name]);
  }
  async render(name, args = []) {
    if (!this.#slots || !this.has(name)) return;
    const result = this.#result;
    if (!Array.isArray(args)) {
      this.#logger.warn(
        null,
        `Expected second parameter to be an array, received a ${typeof args}. If you're trying to pass an array as a single argument and getting unexpected results, make sure you're passing your array as a item of an array. Ex: Astro.slots.render('default', [["Hello", "World"]])`
      );
    } else if (args.length > 0) {
      const slotValue = this.#slots[name];
      const component = typeof slotValue === "function" ? await slotValue(result) : await slotValue;
      const expression = getFunctionExpression(component);
      if (expression) {
        const slot = async () => typeof expression === "function" ? expression(...args) : expression;
        return await renderSlotToString(result, slot).then((res) => {
          return res;
        });
      }
      if (typeof component === "function") {
        return await renderJSX(result, component(...args)).then(
          (res) => res != null ? String(res) : res
        );
      }
    }
    const content = await renderSlotToString(result, this.#slots[name]);
    const outHTML = chunkToString(result, content);
    return outHTML;
  }
}

function matchRoute(pathname, manifest) {
  const decodedPathname = decodeURI(pathname);
  return manifest.routes.find((route) => {
    return route.pattern.test(decodedPathname) || route.fallbackRoutes.some((fallbackRoute) => fallbackRoute.pattern.test(decodedPathname));
  });
}
function isRoute404or500(route) {
  return route.pattern.test("/404") || route.pattern.test("/500");
}

function findRouteToRewrite({
  payload,
  routes,
  request,
  trailingSlash,
  buildFormat,
  base
}) {
  let newUrl = void 0;
  if (payload instanceof URL) {
    newUrl = payload;
  } else if (payload instanceof Request) {
    newUrl = new URL(payload.url);
  } else {
    newUrl = new URL(payload, new URL(request.url).origin);
  }
  let pathname = newUrl.pathname;
  if (base !== "/" && newUrl.pathname.startsWith(base)) {
    pathname = shouldAppendForwardSlash(trailingSlash, buildFormat) ? appendForwardSlash(newUrl.pathname) : removeTrailingForwardSlash(newUrl.pathname);
    pathname = pathname.slice(base.length);
  }
  let foundRoute;
  for (const route of routes) {
    if (route.pattern.test(decodeURI(pathname))) {
      foundRoute = route;
      break;
    }
  }
  if (foundRoute) {
    return {
      routeData: foundRoute,
      newUrl,
      pathname
    };
  } else {
    const custom404 = routes.find((route) => route.route === "/404");
    if (custom404) {
      return { routeData: custom404, newUrl, pathname };
    } else {
      return { routeData: DEFAULT_404_ROUTE, newUrl, pathname };
    }
  }
}
function copyRequest(newUrl, oldRequest) {
  if (oldRequest.bodyUsed) {
    throw new AstroError(RewriteWithBodyUsed);
  }
  return new Request(newUrl, {
    method: oldRequest.method,
    headers: oldRequest.headers,
    body: oldRequest.body,
    referrer: oldRequest.referrer,
    referrerPolicy: oldRequest.referrerPolicy,
    mode: oldRequest.mode,
    credentials: oldRequest.credentials,
    cache: oldRequest.cache,
    redirect: oldRequest.redirect,
    integrity: oldRequest.integrity,
    signal: oldRequest.signal,
    keepalive: oldRequest.keepalive,
    // https://fetch.spec.whatwg.org/#dom-request-duplex
    // @ts-expect-error It isn't part of the types, but undici accepts it and it allows to carry over the body to a new request
    duplex: "half"
  });
}
function setOriginPathname(request, pathname) {
  Reflect.set(request, originPathnameSymbol, encodeURIComponent(pathname));
}

const apiContextRoutesSymbol = Symbol.for("context.routes");
class RenderContext {
  constructor(pipeline, locals, middleware, pathname, request, routeData, status, cookies = new AstroCookies(request), params = getParams(routeData, pathname), url = new URL(request.url), props = {}, partial = void 0) {
    this.pipeline = pipeline;
    this.locals = locals;
    this.middleware = middleware;
    this.pathname = pathname;
    this.request = request;
    this.routeData = routeData;
    this.status = status;
    this.cookies = cookies;
    this.params = params;
    this.url = url;
    this.props = props;
    this.partial = partial;
  }
  /**
   * A flag that tells the render content if the rewriting was triggered
   */
  isRewriting = false;
  /**
   * A safety net in case of loops
   */
  counter = 0;
  static async create({
    locals = {},
    middleware,
    pathname,
    pipeline,
    request,
    routeData,
    status = 200,
    props,
    partial = void 0
  }) {
    const pipelineMiddleware = await pipeline.getMiddleware();
    setOriginPathname(request, pathname);
    return new RenderContext(
      pipeline,
      locals,
      sequence(...pipeline.internalMiddleware, middleware ?? pipelineMiddleware),
      pathname,
      request,
      routeData,
      status,
      void 0,
      void 0,
      void 0,
      props,
      partial
    );
  }
  /**
   * The main function of the RenderContext.
   *
   * Use this function to render any route known to Astro.
   * It attempts to render a route. A route can be a:
   *
   * - page
   * - redirect
   * - endpoint
   * - fallback
   */
  async render(componentInstance, slots = {}) {
    const { cookies, middleware, pipeline } = this;
    const { logger, serverLike, streaming } = pipeline;
    const isPrerendered = !serverLike || this.routeData.prerender;
    const props = Object.keys(this.props).length > 0 ? this.props : await getProps({
      mod: componentInstance,
      routeData: this.routeData,
      routeCache: this.pipeline.routeCache,
      pathname: this.pathname,
      logger,
      serverLike
    });
    const apiContext = this.createAPIContext(props, isPrerendered);
    this.counter++;
    if (this.counter === 4) {
      return new Response("Loop Detected", {
        // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/508
        status: 508,
        statusText: "Astro detected a loop where you tried to call the rewriting logic more than four times."
      });
    }
    const lastNext = async (ctx, payload) => {
      if (payload) {
        pipeline.logger.debug("router", "Called rewriting to:", payload);
        const {
          routeData,
          componentInstance: newComponent,
          pathname,
          newUrl
        } = await pipeline.tryRewrite(payload, this.request);
        this.routeData = routeData;
        componentInstance = newComponent;
        if (payload instanceof Request) {
          this.request = payload;
        } else {
          this.request = copyRequest(newUrl, this.request);
        }
        this.isRewriting = true;
        this.url = new URL(this.request.url);
        this.cookies = new AstroCookies(this.request);
        this.params = getParams(routeData, pathname);
        this.pathname = pathname;
        this.status = 200;
      }
      let response2;
      switch (this.routeData.type) {
        case "endpoint": {
          response2 = await renderEndpoint(componentInstance, ctx, serverLike, logger);
          break;
        }
        case "redirect":
          return renderRedirect(this);
        case "page": {
          const result = await this.createResult(componentInstance);
          try {
            response2 = await renderPage(
              result,
              componentInstance?.default,
              props,
              slots,
              streaming,
              this.routeData
            );
          } catch (e) {
            result.cancelled = true;
            throw e;
          }
          response2.headers.set(ROUTE_TYPE_HEADER, "page");
          if (this.routeData.route === "/404" || this.routeData.route === "/500") {
            response2.headers.set(REROUTE_DIRECTIVE_HEADER, "no");
          }
          if (this.isRewriting) {
            response2.headers.set(REWRITE_DIRECTIVE_HEADER_KEY, REWRITE_DIRECTIVE_HEADER_VALUE);
          }
          break;
        }
        case "fallback": {
          return new Response(null, { status: 500, headers: { [ROUTE_TYPE_HEADER]: "fallback" } });
        }
      }
      const responseCookies = getCookiesFromResponse(response2);
      if (responseCookies) {
        cookies.merge(responseCookies);
      }
      return response2;
    };
    const response = await callMiddleware(middleware, apiContext, lastNext);
    if (response.headers.get(ROUTE_TYPE_HEADER)) {
      response.headers.delete(ROUTE_TYPE_HEADER);
    }
    attachCookiesToResponse(response, cookies);
    return response;
  }
  createAPIContext(props, isPrerendered) {
    const context = this.createActionAPIContext();
    const redirect = (path, status = 302) => new Response(null, { status, headers: { Location: path } });
    Reflect.set(context, apiContextRoutesSymbol, this.pipeline);
    return Object.assign(context, {
      props,
      redirect,
      getActionResult: createGetActionResult(context.locals),
      callAction: createCallAction(context),
      // Used internally by Actions middleware.
      // TODO: discuss exposing this information from APIContext.
      // middleware runs on prerendered routes in the dev server,
      // so this is useful information to have.
      _isPrerendered: isPrerendered
    });
  }
  async #executeRewrite(reroutePayload) {
    this.pipeline.logger.debug("router", "Calling rewrite: ", reroutePayload);
    const { routeData, componentInstance, newUrl, pathname } = await this.pipeline.tryRewrite(
      reroutePayload,
      this.request
    );
    this.routeData = routeData;
    if (reroutePayload instanceof Request) {
      this.request = reroutePayload;
    } else {
      this.request = copyRequest(newUrl, this.request);
    }
    this.url = new URL(this.request.url);
    this.cookies = new AstroCookies(this.request);
    this.params = getParams(routeData, pathname);
    this.pathname = pathname;
    this.isRewriting = true;
    this.status = 200;
    return await this.render(componentInstance);
  }
  createActionAPIContext() {
    const renderContext = this;
    const { cookies, params, pipeline, url } = this;
    const generator = `Astro v${ASTRO_VERSION}`;
    const rewrite = async (reroutePayload) => {
      return await this.#executeRewrite(reroutePayload);
    };
    return {
      cookies,
      get clientAddress() {
        return renderContext.clientAddress();
      },
      get currentLocale() {
        return renderContext.computeCurrentLocale();
      },
      generator,
      get locals() {
        return renderContext.locals;
      },
      // TODO(breaking): disallow replacing the locals object
      set locals(val) {
        if (typeof val !== "object") {
          throw new AstroError(LocalsNotAnObject);
        } else {
          renderContext.locals = val;
          Reflect.set(this.request, clientLocalsSymbol, val);
        }
      },
      params,
      get preferredLocale() {
        return renderContext.computePreferredLocale();
      },
      get preferredLocaleList() {
        return renderContext.computePreferredLocaleList();
      },
      rewrite,
      request: this.request,
      site: pipeline.site,
      url
    };
  }
  async createResult(mod) {
    const { cookies, pathname, pipeline, routeData, status } = this;
    const { clientDirectives, inlinedScripts, compressHTML, manifest, renderers, resolve } = pipeline;
    const { links, scripts, styles } = await pipeline.headElements(routeData);
    const componentMetadata = await pipeline.componentMetadata(routeData) ?? manifest.componentMetadata;
    const headers = new Headers({ "Content-Type": "text/html" });
    const partial = typeof this.partial === "boolean" ? this.partial : Boolean(mod.partial);
    const response = {
      status,
      statusText: "OK",
      get headers() {
        return headers;
      },
      // Disallow `Astro.response.headers = new Headers`
      set headers(_) {
        throw new AstroError(AstroResponseHeadersReassigned);
      }
    };
    const actionResult = hasActionPayload(this.locals) ? deserializeActionResult(this.locals._actionPayload.actionResult) : void 0;
    const result = {
      base: manifest.base,
      cancelled: false,
      clientDirectives,
      inlinedScripts,
      componentMetadata,
      compressHTML,
      cookies,
      /** This function returns the `Astro` faux-global */
      createAstro: (astroGlobal, props, slots) => this.createAstro(result, astroGlobal, props, slots),
      links,
      params: this.params,
      partial,
      pathname,
      renderers,
      resolve,
      response,
      request: this.request,
      scripts,
      styles,
      actionResult,
      serverIslandNameMap: manifest.serverIslandNameMap ?? /* @__PURE__ */ new Map(),
      key: manifest.key,
      trailingSlash: manifest.trailingSlash,
      _metadata: {
        hasHydrationScript: false,
        rendererSpecificHydrationScripts: /* @__PURE__ */ new Set(),
        hasRenderedHead: false,
        renderedScripts: /* @__PURE__ */ new Set(),
        hasDirectives: /* @__PURE__ */ new Set(),
        headInTree: false,
        extraHead: [],
        propagators: /* @__PURE__ */ new Set()
      }
    };
    return result;
  }
  #astroPagePartial;
  /**
   * The Astro global is sourced in 3 different phases:
   * - **Static**: `.generator` and `.glob` is printed by the compiler, instantiated once per process per astro file
   * - **Page-level**: `.request`, `.cookies`, `.locals` etc. These remain the same for the duration of the request.
   * - **Component-level**: `.props`, `.slots`, and `.self` are unique to each _use_ of each component.
   *
   * The page level partial is used as the prototype of the user-visible `Astro` global object, which is instantiated once per use of a component.
   */
  createAstro(result, astroStaticPartial, props, slotValues) {
    let astroPagePartial;
    if (this.isRewriting) {
      astroPagePartial = this.#astroPagePartial = this.createAstroPagePartial(
        result,
        astroStaticPartial
      );
    } else {
      astroPagePartial = this.#astroPagePartial ??= this.createAstroPagePartial(
        result,
        astroStaticPartial
      );
    }
    const astroComponentPartial = { props, self: null };
    const Astro = Object.assign(
      Object.create(astroPagePartial),
      astroComponentPartial
    );
    let _slots;
    Object.defineProperty(Astro, "slots", {
      get: () => {
        if (!_slots) {
          _slots = new Slots(
            result,
            slotValues,
            this.pipeline.logger
          );
        }
        return _slots;
      }
    });
    return Astro;
  }
  createAstroPagePartial(result, astroStaticPartial) {
    const renderContext = this;
    const { cookies, locals, params, pipeline, url } = this;
    const { response } = result;
    const redirect = (path, status = 302) => {
      if (this.request[responseSentSymbol$1]) {
        throw new AstroError({
          ...ResponseSentError
        });
      }
      return new Response(null, { status, headers: { Location: path } });
    };
    const rewrite = async (reroutePayload) => {
      return await this.#executeRewrite(reroutePayload);
    };
    return {
      generator: astroStaticPartial.generator,
      glob: astroStaticPartial.glob,
      cookies,
      get clientAddress() {
        return renderContext.clientAddress();
      },
      get currentLocale() {
        return renderContext.computeCurrentLocale();
      },
      params,
      get preferredLocale() {
        return renderContext.computePreferredLocale();
      },
      get preferredLocaleList() {
        return renderContext.computePreferredLocaleList();
      },
      locals,
      redirect,
      rewrite,
      request: this.request,
      response,
      site: pipeline.site,
      getActionResult: createGetActionResult(locals),
      get callAction() {
        return createCallAction(this);
      },
      url
    };
  }
  clientAddress() {
    const { pipeline, request } = this;
    if (clientAddressSymbol in request) {
      return Reflect.get(request, clientAddressSymbol);
    }
    if (pipeline.serverLike) {
      if (request.body === null) {
        throw new AstroError(PrerenderClientAddressNotAvailable);
      }
      if (pipeline.adapterName) {
        throw new AstroError({
          ...ClientAddressNotAvailable,
          message: ClientAddressNotAvailable.message(pipeline.adapterName)
        });
      }
    }
    throw new AstroError(StaticClientAddressNotAvailable);
  }
  /**
   * API Context may be created multiple times per request, i18n data needs to be computed only once.
   * So, it is computed and saved here on creation of the first APIContext and reused for later ones.
   */
  #currentLocale;
  computeCurrentLocale() {
    const {
      url,
      pipeline: { i18n },
      routeData
    } = this;
    if (!i18n) return;
    const { defaultLocale, locales, strategy } = i18n;
    const fallbackTo = strategy === "pathname-prefix-other-locales" || strategy === "domains-prefix-other-locales" ? defaultLocale : void 0;
    if (this.#currentLocale) {
      return this.#currentLocale;
    }
    let computedLocale;
    const pathname = routeData.pathname && !isRoute404or500(routeData) ? routeData.pathname : url.pathname;
    computedLocale = computeCurrentLocale(pathname, locales, defaultLocale);
    this.#currentLocale = computedLocale ?? fallbackTo;
    return this.#currentLocale;
  }
  #preferredLocale;
  computePreferredLocale() {
    const {
      pipeline: { i18n },
      request
    } = this;
    if (!i18n) return;
    return this.#preferredLocale ??= computePreferredLocale(request, i18n.locales);
  }
  #preferredLocaleList;
  computePreferredLocaleList() {
    const {
      pipeline: { i18n },
      request
    } = this;
    if (!i18n) return;
    return this.#preferredLocaleList ??= computePreferredLocaleList(request, i18n.locales);
  }
}

function sequence(...handlers) {
  const filtered = handlers.filter((h) => !!h);
  const length = filtered.length;
  if (!length) {
    return defineMiddleware((_context, next) => {
      return next();
    });
  }
  return defineMiddleware((context, next) => {
    let carriedPayload = void 0;
    return applyHandle(0, context);
    function applyHandle(i, handleContext) {
      const handle = filtered[i];
      const result = handle(handleContext, async (payload) => {
        if (i < length - 1) {
          if (payload) {
            let newRequest;
            if (payload instanceof Request) {
              newRequest = payload;
            } else if (payload instanceof URL) {
              newRequest = new Request(payload, handleContext.request);
            } else {
              newRequest = new Request(
                new URL(payload, handleContext.url.origin),
                handleContext.request
              );
            }
            const pipeline = Reflect.get(handleContext, apiContextRoutesSymbol);
            const { routeData, pathname } = await pipeline.tryRewrite(
              payload,
              handleContext.request
            );
            carriedPayload = payload;
            handleContext.request = newRequest;
            handleContext.url = new URL(newRequest.url);
            handleContext.cookies = new AstroCookies(newRequest);
            handleContext.params = getParams(routeData, pathname);
          }
          return applyHandle(i + 1, handleContext);
        } else {
          return next(payload ?? carriedPayload);
        }
      });
      return result;
    }
  });
}

function defineMiddleware(fn) {
  return fn;
}

export { RouteCache as R, redirectToFallback as a, redirectToDefaultLocale as b, requestHasLocale as c, defineMiddleware as d, normalizeTheLocale as e, fileExtension as f, slash as g, findRouteToRewrite as h, removeTrailingForwardSlash as i, joinPaths as j, appendForwardSlash as k, RenderContext as l, matchRoute as m, notFound as n, getSetCookiesFromResponse as o, prependForwardSlash as p, requestIs404Or500 as r, sequence as s };
