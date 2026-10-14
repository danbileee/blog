# Multilingual Support & SEO Migration — Assessment and Task Plan

Date: 2026-10-14  
Status: **Final planning amendment only. devOnly policy finalized; ready for T0–T5 implementation approval. Production release remains a separate Owner approval gate.**  
Scope: Next.js 12 Pages Router; Korean original/fallback, optional English and Japanese content; locale-prefixed URLs and SEO migration.

## 1. Recommendation

Use explicit `src/pages/[locale]/…` routes with `type Locale = 'ko' | 'en' | 'ja'`. Keep content pages on build-time SSG, retain existing slugs, and implement only `/` with `getServerSideProps` returning a temporary 307 language-selection redirect. Use narrowly scoped `next.config.js` permanent redirects for old page URLs. Do not introduce built-in `i18n`, Middleware, ISR, or additional infrastructure. Preserve Next.js 12.1.5 and Pages Router throughout T0–T6.

This is a small Pages Router routing change, not a framework migration. It makes the Korean prefix an ordinary route, avoids synthetic locale handling and beta Middleware, and limits request-dependent rendering to the language-selection entry point. UI dictionaries stay in this repository; optional content translations stay in `danbileee/blog-docs`.

Create one build-scoped, commit-pinned normalized content snapshot. Rendering, availability, metadata, sitemap, and RSS must consume that same snapshot. Do not fetch GitHub again for each locale variant.

Two findings affect the migration:

- The existing career page is **`/about`**, not `/career`. Preserve `/about` with a direct 308 to `/ko/career`; also support the requested `/career` redirect.
- Seven `devOnly` blog files are excluded from listings/RSS but are currently included by detail-page generation. The finalized policy makes `devOnly: true` development-only: detail access is allowed only in local `next dev`, with all production-built access prohibited. Historical exposure auditing is non-blocking; no further visibility approval is required.

## 2. Current-state assessment

### 2.1 Evidence and boundaries

Inspected tracked application source, configuration, package manifest/lockfile, cached Next.js package, the external content repository through read-only authenticated GitHub requests, and public production responses. No production code, deployment configuration, external content, or commits changed. No build or migration was executed.

External content tree inspected: `danbileee/blog-docs`, commit `48192fe6b3209a166a265fffe992d3db75094745`; Git tree response was not truncated. There are 25 post files and six career files. No `.en.mdx`/`.ja.mdx` translations currently exist. Frontmatter was inspected for all content files; representative complete documents were inspected for format and rendering conventions. This is a dated inventory; refresh it before release.

Live evidence on 2026-10-14:

- `https://danbileee.com/` and `/about`: HTTP 200.
- `/career` and `/sitemap.xml`: HTTP 404.
- `/rss.xml`: existing feed with 18 public posts and URL-based item GUIDs.
- `/robots.txt`: a comments-only content-signal document in the sampled response; no active `User-agent`, `Disallow`, or `Sitemap` directives. Its source is absent from this repository; confirm whether Cloudflare or another deployment layer supplies it before replacing/augmenting it.
- Headers include `server: cloudflare`, `x-vercel-id`, `x-vercel-cache`, and `x-matched-path`: evidence of Vercel delivery behind Cloudflare. Account settings, build overrides, Cloudflare rules, GeoIP forwarding, deploy hooks, and Search Console data are not available in the repository.

No applicable `AGENTS.md` was found in this project. Credentials were not copied into the plan or exposed in inspection output.

### 2.2 Framework, routing, deployment, rendering

| Area | Finding | Evidence / implication |
| --- | --- | --- |
| Next.js | Exact locked version **12.1.5**; manifest `^12.1.5` | `package.json`, `yarn.lock`, `.yarn/cache/next-npm-12.1.5-*.zip`; keep lockfile/version unchanged for this work |
| React / React DOM | Exact locked **18.2.0** | Manifest `^18.2.0`; type resolutions are 17.0.2, an existing mismatch to baseline rather than silently change |
| Router | Pages Router, under `src/pages` | No App Router |
| Tooling | Yarn 4.18.1, Plug'n'Play; TypeScript 4.6.3 | Bundled Yarn release/cache; existing lint stack includes Next 11 ESLint config |
| Scripts | `next dev`, `next build`, `next start`, `next lint` | No test runner, export script, or content refresh script |
| Hosting | Live Vercel + Cloudflare evidence | No tracked Vercel/Netlify/Docker/CI deployment configuration; dashboard behavior still needs confirmation |
| Config | Image domain allowlist, device sizes `[600,1080,1920]`, `transpilePackages: ['react-syntax-highlighter']` | `next.config.js`; no i18n, redirects, rewrites, headers, basePath, or trailingSlash option |
| Existing config caveat | Cached 12.1.5 default config has no `transpilePackages` option | Do not assume the setting works on this version; baseline syntax-highlighter/build behavior before attributing failures to i18n |
| Homepage | Automatically statically optimized | `src/pages/index.tsx`, no data-fetching hook |
| Career | SSG | `src/pages/about/index.tsx`, `getStaticProps`, no `revalidate` |
| Blog listing | SSG plus build-time RSS filesystem side effect | `src/pages/blog/index.tsx`, `getStaticProps`, no `revalidate` |
| Blog detail | SSG; all directory entries enumerated; `fallback: false` | `src/pages/blog/[slug].tsx`, `getStaticPaths` + `getStaticProps`, no `revalidate` |
| SSR / ISR | No current SSR or explicit ISR found | Content changes need an application rebuild/redeploy |
| Static export | No tracked use of `next export` or `exportPathMap` | This does not prove dashboard build commands; server redirects/root SSR require a Next-capable deployment |
| Middleware | None | 12.1.5 requires the old `src/pages/_middleware.ts` convention if used |
| Content cache | No shared application content cache, ETag handling, persisted snapshot, or retries | Listing/detail/career each independently fetch GitHub; deployment CDN caching is separate |

### 2.3 Exact-version compatibility

The version-tagged [12.1.5 i18n guide](https://github.com/vercel/next.js/blob/v12.1.5/docs/advanced-features/i18n-routing.md) confirms built-in i18n support, an unprefixed default locale, a synthetic `default` locale workaround using `pages/_middleware.ts`, and incompatibility with `next export`.

The [12.1.5 Middleware guide](https://github.com/vercel/next.js/blob/v12.1.5/docs/advanced-features/middleware.md) calls Middleware beta and documents nested `_middleware` files. [Next.js 12.2](https://nextjs.org/blog/next-12-2) made Middleware stable and changed its conventions. Do not copy contemporary `middleware.ts`/`proxy.ts` examples or modern cookie APIs into 12.1.5.

The synthetic-default approach is documented for this exact release, but is excluded from the approved architecture. For historical compatibility assessment only, it would need `locales: ['default', 'ko', 'en', 'ja']`, `defaultLocale: 'default'`, automatic detection disabled, old-style Middleware, suppression of synthetic content paths, exclusion of non-page endpoints, and deployment-specific smoke tests. Hosting settings have not been verified sufficiently to certify that approach in production. The recommended explicit dynamic segment avoids those concerns.

[12.1.5 redirect documentation](https://github.com/vercel/next.js/blob/v12.1.5/docs/api-reference/next.config.js/redirects.md) confirms `permanent: true` produces 308 and retains query values. Existing dynamic SSG already demonstrates the core route mechanism; nested `[locale]` parameters use the same Pages Router data-fetching model. Root request-time detection uses the existing-version [getServerSideProps API](https://github.com/vercel/next.js/blob/v12.1.5/docs/basic-features/data-fetching/get-server-side-props.md). Runtime validation remains a required implementation gate, not a claimed completed test.

**No Next.js upgrade is required by the proposed design.** If hosting secretly uses static export, explicit locale SSG can still generate content, but root HTTP language detection and permanent redirects require existing host/server support. A client-side language redirect would not satisfy the requirements. Reassess only that hosting gap; do not upgrade the framework as a substitute.

### 2.4 Content sources and behavior

| Page / component | Current implementation |
| --- | --- |
| Homepage | Hardcoded Korean prose with English heading; commented English prose in `src/pages/index.tsx`; no Japanese copy |
| Career | `careers/*.mdx`, one document per company/entry; `gray-matter` parses metadata/body; `CareerMeta` plus Markdown renderer |
| Blog listing | Directory `posts`, one raw request per entry; frontmatter only retained; filters `devOnly`, sorts by `publishedAt` descending |
| Blog detail | Fetches `posts/${slug}.mdx`; title/body rendered together; no visibility filter |
| Header / footer | Local application components; navigation labels currently `about`/`blog`, Korean icon alt text and date labels |
| Content client | `src/constants/octokit.ts`, Octokit REST contents API, `GITHUB_ACCESS_TOKEN`, repository `danbileee/blog-docs`, default branch implicitly used |
| Markdown | `.mdx` filename but **`markdown-to-jsx`**, not an MDX compiler; overrides for headings, images, code, links, lists, tables, etc. |

Post frontmatter: `category?`, `title`, `publishedAt`, `updatedAt`, `description`, `tags`, `ogImage`, `devOnly?`. Career: `company`, `startYear`, `endYear?`, `description`, `website?`, `devOnly?`, body; current `id` is derived from the API response URL. Stable identity should instead use the unchanged Korean file path.

Slug generation is inconsistent: detail paths remove `.mdx` from directory filenames; listing `getSlug.ts` strips a specific encoded GitHub API URL prefix. Replace the fragile URL extraction with basename-based identity while proving that every current slug remains identical.

Missing/error handling currently has gaps: list endpoints returning a non-array can become an empty page; detail `getStaticPaths` returns an invalid bare array in that branch; thrown GitHub errors fail generation; empty detail content renders `null`; directory entries are not restricted to source documents. Adding sibling translations without grouping would create duplicate cards/paths. These are relevant to this change and must be corrected in the shared loader.

### 2.5 Current SEO and links

- `src/components/layout/PageMeta.tsx`: titles, description attached to a combined OG/description tag, keywords, image dimensions, icons/manifest. No canonical, hreflang, explicit robots policy, Twitter tags, or JSON-LD found. `og:url` always points to the homepage; `og:locale` always `ko_KR`; image-bearing pages use `og:type="blog"`.
- `_app.tsx` infers metadata from route patterns; details supply their own PageMeta. `getMetaInfo.ts` assumes the first path segment is the menu and must change for `[locale]` routes.
- `_document.tsx`: hardcoded `<Html lang="ko">`.
- No tracked sitemap generator or robots file. Live `/sitemap.xml` is 404. Add these deliberately; coordinate with upstream robots delivery.
- RSS generated inside listing `getStaticProps` writes `public/rss.xml` (gitignored). Feed origin is hardcoded `https://danbileee.com`; item link and default GUID use old `/blog/:slug` URLs.
- No structured data found to migrate; do not add a schema system as part of required work.
- Header logo, navigation, and cards use plain anchors to `/`, `/about`, `/blog`, and `/blog/:slug`. Internal Markdown links can also target old absolute URLs. Fragment links are used for headings. Footer RSS is an absolute existing endpoint.
- No tracked redirects or API routes. Production domain/trailing-slash/CDN rules outside the repository remain an audit item.

### 2.6 Public URL inventory

Production origin currently evidenced: `https://danbileee.com`. Configure one validated production origin and share it across metadata/feed/sitemap; preview deployments must not become alternate canonical origins.

| Existing URL / family | Current role | Migration |
| --- | --- | --- |
| `/` | Homepage | 307 locale-selection entry point |
| `/about` | Actual career page | 308 `/ko/career` |
| `/career` | Currently 404; requested compatibility alias | 308 `/ko/career` |
| `/blog` | Public listing | 308 `/ko/blog` |
| `/blog/:slug` | Blog details | 308 unchanged slug under `/ko/blog/:slug` |
| `/rss.xml` | Existing Korean RSS | Preserve endpoint and item identities |
| `/en/rss.xml`, `/ja/rss.xml` | New planned translation-only RSS endpoints | Generate static files; no locale redirect; preserve once released |
| `/robots.txt` | Upstream-delivered comments in observed response | Preserve upstream policy, add compatible sitemap declaration |
| `/sitemap.xml` | Currently absent | New non-localized sitemap endpoint |
| `/_next/*`, `/api/*` | Framework resources / reserved API namespace | Never locale-redirect |
| Public files | Images, icons and manifest | Keep unprefixed and unchanged |

The 18 published post slugs below are present in both the content tree and live RSS. Each existing `/blog/<slug>` needs a direct redirect to `/ko/blog/<slug>`:

```text
why-i-am-building-furigana
compound-component-pattern-for-design-system
ai-sales-copilot-3
ai-sales-copilot-2
ai-sales-copilot-1
how-to-adopt-a-new-wysiwyg-editor
working-backwards-from-the-user-experience
error-handling-from-scratch
email-editor-demo
looking-back-on-2022
shortqna-array-vs-object
shortqna-is-js-single-threaded
to-separate-or-not-to
object-study-11
object-study-7
how-to-choose-wysiwyg
on-folder-structure-of-vary-editor
redux-with-react-context-api
```

Seven additional source slugs currently enter `getStaticPaths` despite `devOnly: true` (potential public detail URLs; production status/index coverage not individually verified):

```text
computer101-01-introduction
how-to-use-useeffect
regex-01-introduction
regex-02-find-one-char
regex-03-find-by-char-set
shortqna-what-is-generator
to-automate-or-not-to
```

Career source keys: `liws`, `myrealtrip`, `tsunagaru`, `vary`, `yess`; `clayout` is `devOnly` and filtered. There are no separate career-entry routes. Public files: `/favicon.ico`, `/safari-pinned-tab.svg`, `/blocks.jpeg`, `/android-chrome-384x384.png`, `/favicon-16x16.png`, `/logo.png`, `/site.webmanifest`, `/apple-touch-icon.png`, `/android-chrome-192x192.png`, `/browserconfig.xml`, `/mstile-150x150.png`, `/favicon-32x32.png`. Do not expose `.DS_Store` as a user-facing content route.

Inventory describes reachable/source routes, not proof that every route is indexed. Use available Search Console, backlinks/access logs and deployment aliases to extend this inventory without guessing destinations; do not block the half-day release on a broad historical investigation. Confirm active host redirects as part of the routing gate.

## 3. Proposed implementation design

### 3.1 Routing and preference

Create these routes, reusing existing page components and styles:

```text
src/pages/index.tsx                    # SSR redirect only
src/pages/[locale]/index.tsx           # SSG: ko/en/ja
src/pages/[locale]/career.tsx          # SSG: ko/en/ja
src/pages/[locale]/blog/index.tsx      # SSG: ko/en/ja
src/pages/[locale]/blog/[slug].tsx     # SSG: locale × visible slug
```

Validate `params.locale` against the three allowed identifiers. No regional or synthetic locale routes. Unknown locales/slugs use the existing 404 behavior; only a missing **translation of an accessible source** must return 200. Use `getStaticPaths` with `fallback: false` on each dynamic route; in local `next dev`, include draft detail paths for inspection, while production generation includes published sources only. Enforce the same visibility in detail `getStaticProps` so direct data/preview requests cannot bypass path filtering; adding posts/translations refreshes via rebuild. Do not introduce ISR.

At `/` only:

1. Read a valid manually selected `NEXT_LOCALE` cookie (`ko`, `en`, or `ja`). Ignore invalid cookie values safely.
2. Parse `Accept-Language` by quality weights, stable header order for ties, normalize regional variants to base locale; exclude `q=0`, ignore malformed ranges and unsupported languages. A wildcard is not a specific supported-language match.
3. Only if no supported language matches, use a verified trusted hosting country signal: `KR → ko`, `JP → ja`, other known countries → en. Unknown/missing country → ko. Do not trust arbitrary client-supplied country headers. Initially omit this step unless existing infrastructure exposes it reliably to root SSR.
4. Return `redirect: { destination: '/<locale>' + originalQuery, permanent: false }`. Preserve query parameters without introducing a second redirect or accepting an external redirect destination.

Set root response `Cache-Control: private, no-store` and appropriate `Vary: Cookie, Accept-Language` (plus the trusted country header if used). Confirm Cloudflare/Vercel do not cache one visitor's selection for another. Localized pages remain public static HTML, independent of cookies and browser languages. Do not write preference cookies during automatic detection or ordinary explicit-locale navigation.

Language selector: a clearly discoverable native labeled `<select>` in the shared header, present in both desktop and mobile navigation, with 한국어 / English / 日本語 options, visible indication of the selected URL locale, accessible labeling, keyboard interaction and visible focus states. On manual selection write host-only `NEXT_LOCALE`, `Path=/`, `Max-Age=31536000`, `SameSite=Lax`, `Secure` in production; it is intentionally readable by the selector, not HttpOnly. Client-side `router.push` changes the concrete locale segment and preserves slug, query and hash; no shallow routing because new content props are needed. For this explicit route design, do not rely on `router.locale` or `router.push(..., { locale })`.

The explicitly requested URL locale is authoritative. Use URL-derived page props for initial rendering and a read-only locale hook/context for shared UI if needed; do not maintain independent client-side locale state that can disagree with the URL. Use `next/link` with the Next 12 child-anchor convention. Header logo goes directly to the selected locale homepage. Do not read cookies/navigator to choose UI language during hydration. Cookie failure must not prevent URL switching. Switching must preserve the route category, unchanged slug, query and fragment and must work even when the destination translation is missing or invalid; that destination renders Korean fallback under its requested locale.

### 3.2 Legacy redirects

In `next.config.js`, add individual `permanent: true` rules:

```text
/about       → /ko/career
/career      → /ko/career
/blog        → /ko/blog
/blog/:slug  → /ko/blog/:slug
```

Use the one-segment blog detail pattern, not a global catch-all or arbitrary extension filter. Verify existing content namespace has no file/API/feed conflicts. Keep `/` out of permanent rules. Do not add automatic-language logic to old URLs or explicit locale routes. Relevant queries pass through; canonical URLs omit tracking queries. Browser fragments are not transmitted to the server; verify browser fragment retention and preserve them explicitly in client switching.

Do not change trailingSlash globally. Test `/blog/` and `/about/`: if framework slash normalization creates chains, add narrowly scoped handling supported by the exact version/host, or document the unavoidable normalization exception. Canonical legacy forms must redirect in one hop. Internal links should already point to final localized paths, avoiding redirect requests altogether.

### 3.3 UI localization

Add typed dictionaries under `src/i18n/messages/{ko,en,ja}.ts`, covering homepage prose, navigation, shared metadata, selector label, footer/icon alt text, logo accessible name, dates, content-origin indicators, banners, empty-state and error UI. Reuse commented English homepage text only after review; author Japanese copy without a translation service. Use rich JSX slots for the existing Furigana link rather than translating raw HTML strings.

Use a locale-aware `getDisplayDate` formatter (existing dayjs or a small deterministic formatter). Dates and copyright must render consistently between build/server and client; do not introduce request-dependent values into static HTML. Keep layout and unrelated components unchanged; check Japanese typography within existing widths.

### 3.4 Optional content files and identity

Keep current Korean documents untouched. Add optional sibling files to the external repository:

```text
posts/my-post.mdx
posts/my-post.en.mdx
posts/my-post.ja.mdx
careers/myrealtrip.mdx
careers/myrealtrip.en.mdx
careers/myrealtrip.ja.mdx
```

This is additive and matches actual `.mdx` conventions. The application loader must group suffixes **before** listing/generating routes. Translation files never become post identities. Only original Korean files establish IDs, slugs, page/listing ordering, original publication dates, shared images, websites, visibility, and source existence. Localized RSS may use a separate translation publication timestamp as defined below. Detect collisions if a legacy Korean basename happens to end in `.en`/`.ja`; none observed in the current inventory. Orphan translations are reported and ignored.

Blog translation frontmatter requires localized `title` and `description`; body must be non-empty and parseable. Optional translated `category`/`tags` can be accepted as a whole-document addition. Career translation requires `company`, `description`, and non-empty body. New translations should explicitly declare `locale` and `translationStatus: complete`; incomplete/draft files fall back. This declaration is new-file-only, not required on Korean originals. Schema validation confirms structure; editorial review confirms that the declared language and complete translation are truthful. It cannot automatically prove linguistic quality.

Inherit shared metadata from Korean. If a translation repeats shared fields, reject conflicting values rather than allow differing identity/date/visibility; matching redundant values are acceptable. Do not mix translated title with Korean body. Document authoring rules in the external repository only after approval and after the new loader is deployable.

#### Translation publication metadata

Support optional `translationPublishedAt` on article translations, independently of Korean `publishedAt`:

```yaml
locale: en
translationStatus: complete
translationPublishedAt: '2026-10-15T00:00:00Z'
```

Authoring policy: record the first publication time of the completed translation, quote it as an ISO 8601 timestamp with an explicit timezone (prefer UTC `Z`), and keep it unchanged for edits, rebuilds, withdrawal and republication of the same translation. It does not override original dates or shared identity. Do not infer it from commit time, fetch time or build time. Do not treat a future timestamp as a scheduling feature: flag it for editorial correction before publication.

Validation policy: accept a strictly valid timezone-qualified timestamp string, or normalize a date value produced by the existing frontmatter YAML parser to the same UTC instant. Reject ambiguous timezone-free/invalid dates and future publication timestamps with diagnostics; a malformed explicit timestamp makes that translation invalid under the existing non-fatal fallback policy. Completed translations without this optional field remain compatible and usable: localized RSS `pubDate` falls back deterministically to the Korean original `publishedAt`, using the existing original-date interpretation, never build time. Recommend recording the timestamp on first publication of every new completed translation. Adding/correcting it later changes only feed date/order, not GUID; review that change because subscribers may reorder items. This field is feed publication metadata, not an independent translation-availability requirement when absent.

**Deployment order matters:** the old app would treat translation siblings as duplicate posts. Release the grouping-capable loader before adding external siblings, or coordinate an atomic content-pinned release. Preserve a pre-translation content commit for rollback to the old loader.

### 3.5 Availability, fallback, errors

Add a single normalized decision, for example:

```ts
type TranslationState = 'original' | 'available' | 'missing' | 'invalid' | 'fetch-error';
interface LocalizedContent<T> {
  id: string;
  requestedLocale: Locale;
  contentLocale: Locale;
  state: TranslationState;
  translationAvailable: boolean;
  content: T;
  availableLocales: Locale[];
}
```

`translationAvailable` is true for a usable requested-language document (including Korean original); `state` disambiguates original from translation. Resolve `ko → ko`, `en → en ?? ko`, `ja → ja ?? ko`. No cross-fallback between English and Japanese. Availability and page indexability are separate: document availability plus visibility and page-specific aggregate policy determine indexing.

| Condition | Loader / publishing behavior |
| --- | --- |
| Valid Korean original | Render Korean; use original shared fields |
| Valid complete requested translation | Render that entire document |
| Translation absent from authoritative tree | Non-fatal `missing`; render Korean, banner, noindex |
| Translation present but invalid/incomplete | Non-fatal `invalid`; render Korean, banner, noindex; report file/reason without secrets |
| Temporary GitHub error, rate limit, authorization failure, listed file unexpectedly 404 | Bounded retry; `fetch-error`, not absence. Abort new build if a coherent authoritative snapshot cannot be obtained; existing deployed HTML remains live |
| Original missing/invalid for known content | Block new snapshot/build; never deploy empty pages or treat an outage as deletion |
| Truly unknown slug | 404 after successful source inventory resolution |

No initial runtime GitHub dependency. Build failure on unavailable authoritative source is intentional reliability protection; missing/invalid optional translations do not fail builds. Do not silently publish widespread noindex or empty sitemaps after a transient fetch failure. ISR is outside this plan; existing deployed static pages and feeds remain the recovery source.

#### Finalized development-only draft policy

**Resolved Owner requirement:** `devOnly: true` on the Korean original makes the entire content identity an unpublished local-development draft, including every translation. No further Owner decision is required to implement this visibility policy. Keep the existing frontmatter and external repository structure:

```yaml
---
title: 'Draft Article'
devOnly: true
---
```

Local `next dev` must allow direct `/ko/blog/:slug`, `/en/blog/:slug`, and `/ja/blog/:slug` draft detail navigation. Render the real detail layout, Markdown, typography and responsive behavior, with normal locale UI, header switching, completed translations and Korean fallback/banner behavior. No need to publish the draft, authenticate, supply preview tokens, or create a public preview endpoint. Keep drafts out of normal listings, all feeds and sitemap even during development. Local draft detail pages have no canonical/hreflang or public discovery metadata; a defensive development `noindex,follow` is allowed but is never production protection.

| Environment | Draft detail | Public listing | RSS / sitemap |
| --- | --- | --- | --- |
| Local `next dev` | Accessible with normal localization/fallback | Excluded | Excluded |
| Local `next build` + `next start` | 404 | Excluded | Excluded |
| Vercel Preview deployment (production build) | 404 | Excluded | Excluded |
| Production deployment | 404 | Excluded | Excluded |

Restrict the development workflow to loopback/local inspection; do not deploy, tunnel or expose the draft-enabled dev server publicly. Next.js 12.1.5's cached CLI supports `next dev --hostname 127.0.0.1` (its default is `0.0.0.0`); use a loopback-bound development script during implementation. This is not a new endpoint or access-control service.

Production preparation must inspect original frontmatter internally to determine visibility **before** adding documents to the normalized snapshot or other output. Drop draft records/bodies from the production snapshot entirely and skip loading their translations where possible. Raw responses may be inspected in memory, but must never be written to build artifacts, temporary persisted raw-content caches, logs, generated assets or public props. Translations cannot independently publish a draft. An unreadable original or malformed frontmatter/flag must fail safely rather than assume publication; an omitted devOnly field on valid frontmatter is published, as below. Preserve legitimate originals with omitted `devOnly` or boolean `false`; validate invalid flag types instead of relying on string truthiness.

Use a small server-only separation between published snapshot loading and local-development draft fetching. The build preparation entry point is always published-only. Local draft reads are available only in the actual Next development-server phase; do not rely on a caller-controlled `NODE_ENV`, `VERCEL_ENV=preview`, custom environment variable, query flag or Next preview configuration to enable them. Next.js 12.1.5 exposes development/build phase constants; verify phase-gated wiring with focused shared tests and section 6's production artifact/404 checks. No include-drafts override exists for `next build` or `next start`. Development draft bodies may be serialized only to the local dev response needed for layout inspection, never to the production snapshot. Do not persist/reuse draft-containing development inputs for production preparation. At local dev startup, prepare the same published-only snapshot for normal pages and read draft details server-side in memory from its pinned source ref; keep any development memoization process-local. Restart/reprepare local dev to inspect a newer content ref. No draft snapshot or persistent synchronization layer is needed.

Every `next build`, whether local, Vercel Preview or production, must omit drafts from static paths, generated HTML, serialized props/Next data, JavaScript bundles, snapshots/assets, listings, all three RSS feeds, sitemap, canonical/hreflang and other public metadata/discovery. Production-built localized draft URLs return 404; do not generate a draft page and protect it with noindex. Legacy `/blog/:draftSlug` retains the approved 308 to `/ko/blog/:draftSlug`, whose final production response is 404. Previously shared/indexed draft URLs transition to 404 without retaining access; audit historical exposure for post-release checks, not as an implementation blocker.

Removing `devOnly` or setting it to boolean `false` makes the original and its valid translations eligible for normal publication at the next successful build. Existing article SEO, localized listing noindex, Korean fallback, feed GUID/date rules and source-derived identity still apply. No draft-specific authoring structure or public draft UI is introduced.

Career fallback is **per entry**, because current content already consists of independent career documents. Each entry uses translated company/description/body together or the complete Korean entry, with `lang="ko"` around fallback text. Show one concise page banner if any visible entry falls back, plus a small original-language indicator if needed. The career page is indexable in en/ja only when every public entry has a valid translation. Avoid collapsing six existing files into a new monolithic document.

Blog listing keeps every public post and selects each card from the same document availability result. Fallback cards retain Korean title/excerpt with `lang="ko"` and a small localized “Korean original” indicator, not a large repeated banner.

For detail content and career fallback, use these banner strings in the requested UI language:

- English: “An English translation isn't available yet. The original Korean version is shown below.”
- Japanese: “この記事の日本語訳はまだ公開されていません。韓国語の原文を表示しています。”

Use a small informational section above content, no modal/confirmation. It appears for missing/invalid translations and disappears from generated HTML on the next successful refresh when a valid translation is available. Career partial-fallback copy should say that some entries show Korean originals. Korean originals never show an unavailable banner.

### 3.6 SEO policy

Build a page SEO result from the same snapshot used to render it. One helper computes indexability, canonical, alternates and metadata; sitemap consumes that helper rather than independently testing filenames.

| Page | Indexability rule |
| --- | --- |
| Korean public page | Indexable subject to approved publication rules |
| English/Japanese homepage | Indexable after all primary homepage copy/metadata and shared UI are genuinely localized |
| English/Japanese article | Indexable only with valid complete requested translation |
| English/Japanese career | Indexable only when every public career entry is validly translated |
| English/Japanese blog listing | Initial-release fixed policy: HTTP 200 with `noindex,follow`, regardless of translation coverage; no canonical, hreflang or sitemap inclusion |
| devOnly draft | Local next dev detail only, no canonical/hreflang/discovery; production build excludes the content entirely and requests return 404 |

`/ko/blog` remains indexable. `/en/blog` and `/ja/blog` remain `noindex,follow` for the initial release, whether translations are absent, partial, complete, or the listing is empty. All public posts remain visible: use translated titles/descriptions when available, otherwise Korean fallback. Publishing an untranslated article or completing all translations must not toggle listing indexability. Fully translated individual articles remain independently indexable and eligible for localized RSS. Any future listing indexability change is an explicit editorial/SEO decision requiring Owner approval, not an automatic coverage calculation. Career retains its existing full-public-entry coverage rule.

Indexable pages: self-canonical clean production URL, `index,follow`, sitemap inclusion, reciprocal alternates for indexable versions of the same identity. Fallback/partial pages and the fixed-noindex English/Japanese listings: HTTP 200, `noindex,follow`, **omit canonical and hreflang**, exclude from sitemap. Never combine noindex with a Korean cross-language canonical. Do not block fallback URLs in robots.txt: crawlers must see noindex.

Homepage alternates: `ko → /ko`, `en → /en`, `ja → /ja`, `x-default → /`. Root is a redirecting selector, not another indexable content homepage; do not include `/` as a canonical sitemap content entry. Other pages use only actually indexable language siblings and include themselves. No x-default on article/career/listing clusters initially.

`PageMeta` must output distinct title/description/OG/Twitter tags, page-specific `og:url`, appropriate OG locale, and explicit language data. Valid translated article metadata comes from its translation; fallback article title/description stay Korean, with content-language OG locale `ko_KR` despite translated surrounding UI. Do not invent English/Japanese article summaries. Preserve original dates, tags/image identity, and use the existing configured production origin. Use `og:type="article"` for articles if validated with existing consumers.

Set `<html lang>` from requested-locale page props in `_document.tsx` for initial HTML; explicit routing means Next's built-in locale auto-setting is unavailable. Read the locale in Document render via Next page data or equivalent supported Document props. T4/T5 must verify the simplest supported Next.js 12.1.5 Document/page-props implementation using section 6's one-build artifact/initial-HTML checks: every locale route must emit `<html lang="ko">`, `<html lang="en">`, or `<html lang="ja">` in its initial HTTP HTML, including Korean fallback pages. Avoid a custom rendering abstraction or framework upgrade. On client-side navigation keep `document.documentElement.lang` in sync in `_app.tsx`; this complements, not replaces, server-rendered language. Korean fallback containers explicitly use `lang="ko"`. Deduplicate Head tags and ensure only one page metadata producer per route.

Generate `public/sitemap.xml` from all approved indexable canonical pages; include translation variants only when valid, omit legacy/fallback/private URLs. Use actual content update dates for article `lastmod`, not rebuild time. Add sitemap declaration to compatible robots output without deleting upstream policy. Do not introduce a new sitemap dependency unless escaping/serialization demands it.

#### Three language-specific RSS feeds

Reuse the existing `rss` package; generate RSS only, with no Atom, JSON Feed, or other additional formats. Generate these static public assets through the same build preparation process:

| Channel language | Endpoint / output file | Items | Item links and identity |
| --- | --- | --- | --- |
| `ko` | `/rss.xml` / `public/rss.xml` | All public Korean original articles | Links `O/ko/blog/:slug`; preserve every existing Korean GUID exactly |
| `en` | `/en/rss.xml` / `public/en/rss.xml` | Only public articles with valid completed English translations | Links `O/en/blog/:slug`; stable locale-specific GUID `O/en/blog/:slug` |
| `ja` | `/ja/rss.xml` / `public/ja/rss.xml` | Only public articles with valid completed Japanese translations | Links `O/ja/blog/:slug`; stable locale-specific GUID `O/ja/blog/:slug` |

Here `O` is the validated production origin. Assign GUIDs explicitly; never allow changed links, timestamps or build IDs to regenerate item identities. Capture the existing Korean GUID mapping in T0 and verify exact XML values/permalink semantics. For future Korean posts, retain the legacy identity convention `O/blog/:slug`. Keep `/rss.xml`, Korean publication dates and descending publication ordering stable so existing subscribers do not receive historical posts again as new entries. Localized GUIDs are distinct from Korean and each other and remain unchanged when a translation is edited or withdrawn/reintroduced.

English/Japanese feeds never include Korean fallback, missing/incomplete/invalid translations, orphan translations or unpublished sources. Use localized article titles/descriptions, localized channel titles/descriptions and channel language `ko`, `en`, or `ja`. Each channel's site link points to its locale blog listing and its feed URL points to its own endpoint, even though en/ja listings are noindex. Localized item `pubDate` uses `translationPublishedAt` when present, otherwise the stable original publication date as above; order localized items descending by that effective date with a deterministic slug tie-breaker. Dates do not change on rebuild or ordinary edits, and original Korean `publishedAt` remains unchanged. Each localized feed must be valid RSS with channel metadata and zero items when no eligible translations exist. Validate all three XML files and serve them as `application/rss+xml` (UTF-8); if host MIME inference differs, use the smallest compatible Next/host header setting after verification.

Feed discovery and subscription UI use the current requested page locale, including fallback article pages: ko → `/rss.xml`, en → `/en/rss.xml`, ja → `/ja/rss.xml`. Preserve the existing footer RSS subscription interaction/icon but localize its accessible text and destination. `PageMeta` emits one locale-appropriate autodiscovery link, for example:

```html
<link
  rel="alternate"
  type="application/rss+xml"
  title="Blog RSS — English"
  href="https://danbileee.com/en/rss.xml"
/>
```

Build the actual href from configured `O`; localize the title for each channel. RSS discovery links have `type="application/rss+xml"` and no `hreflang`; use distinct Head keys from language alternates. Do not let fixed listing noindex or missing-translation hreflang suppression remove feed discovery. `/rss.xml`, `/en/rss.xml`, and `/ja/rss.xml` are file endpoints, never content routes or locale-detection destinations; no redirect rules or catch-all localized page route may intercept them. Feeds are not canonical content entries in the page sitemap. No existing JSON-LD was found; adding it remains optional.

### 3.7 Build and refresh performance

Extract GitHub fetching from pages into a server-only loader. Resolve one external commit SHA at build start; read tree/documents with that ref to avoid files changing mid-build. Limit concurrent requests, retry transient errors with bounded backoff, validate tree completeness and file kinds, and normalize once.

Run a build preparation script before `next build` that writes one ignored `.cache/i18n-content.json` (or similarly scoped artifact) plus generated SEO assets. Production pages read the published-only snapshot, which contains no draft records or bodies; keep it outside `public` and out of client imports. Local `next dev` uses the separate server-only draft read path described above, never a draft-inclusive production snapshot. Only serialize each route's required public content to page props. Do not embed all languages/bodies into listing props. Keep this a small deterministic build-time implementation: no persistent caching infrastructure, database, external content service or generalized synchronization framework. This temporary build input is not a repository duplication or new hosted content service.

Current content has 25 original posts (18 listed public) and six careers (five public). A public-only policy yields **54 article variants + nine home/career/listing variants = 63 static pages**, plus root SSR. The finalized draft exclusion requires this public-only production count; the existing 75 potential detail variants include drafts and are not an allowed production target. Local dev may resolve draft variants on demand. Fallback routes still need HTML but reuse Korean parsed content. Snapshot requests scale with source and existing translation files, not the number of locale renders; with only Korean files today this is roughly one commit lookup + one tree + 31 document requests, subject to visibility-aware optimization. Measure baseline rather than promise a fixed build duration.

Move RSS writing out of listing `getStaticProps`; otherwise three locale builds would concurrently overwrite the same file. Generate sitemap and all three RSS feeds once after snapshot validation and before Next build, using the same snapshot. If Next build fails, do not deploy newly generated assets separately. At preparation start invalidate any previous ready marker/snapshot consumption and remove stale generated outputs; never package draft HTML/data/assets left by an earlier dev run or old build. Verify a dev-to-build transition in T5. Do not add broad destructive cleanup; use build-owned generated paths. Then stage outputs in a temporary build-local directory and mark them ready only after all snapshot and feed validation succeeds. Fail fast before `next build` on any preparation failure; never reuse a stale snapshot or partially written feed, even for the same commit. Consume the server-only snapshot and publish the generated sitemap and three feeds only as part of a successful complete application deployment; never serve the snapshot as a public file. No separate RSS pipeline or independently deployed assets.

Initial refresh mechanism remains rebuild/redeploy. No tracked external-repository deploy hook exists: confirm whether one already exists; otherwise Owner must redeploy after content changes. A translation update refreshes page HTML, availability, banner, canonical/hreflang, listing/career aggregates, sitemap and RSS in the **same deployment**. Do not claim immediate automatic detection of GitHub changes without a trigger. An existing Vercel deploy hook can be reused later; new webhook infrastructure and ISR are excluded from this plan.

## 4. Incremental implementation task plan

All tasks below are pending. T0–T5 begin only after implementation approval; devOnly visibility itself is already finalized and needs no additional approval or blocking exposure audit. Each increment should be reviewable; T6 production activation retains its separate release approval gate.

### T0 — Confirm deployment and publication baseline

- [ ] Confirm Vercel build command, Node runtime, locked dependency installation, no `next export`, Cloudflare redirect/cache rules and robots ownership.
- [ ] Capture the complete existing Korean RSS GUID/date/order mapping and published slug baseline. Reuse existing build logs/artifacts for timing, request counts and rendering baseline; run lint/type checks once with T5, without an extra baseline build. Existing toolchain warnings are not permission to upgrade.
- [ ] Identify all current `devOnly` posts (refresh the seven-file inventory); document existing local dev and production behavior and record known previously accessible/shared/indexed draft URLs from Search Console/backlinks/access logs/host rules. This exposure audit is non-blocking and no longer a publication-policy approval gate; previously public drafts still transition to 404.
- [ ] Confirm canonical production origin and external-content refresh procedure.

Acceptance: no hidden static-export incompatibility, current URLs/SEO assets captured, finalized development-only draft rules recorded and rollback artifacts available; unavailable historical exposure evidence does not block implementation.

### T1 — Shared content model and snapshot (before translations are added)

- [ ] New `src/lib/content/{github,snapshot,localize,types}.ts`: server-only commit-pinned fetch, grouping, validation, identity, availability, optional translation publication metadata and deterministic effective feed dates.
- [ ] New `scripts/prepare-content.ts`: bounded fetching and minimal published-only snapshot generation with staged outputs/failure invalidation, no persistent cache; adapt `package.json` build script to invoke it with existing ts-node/tooling after compatibility validation. Prepare published data for local dev startup too; local drafts use an in-memory server-only reader at that pinned ref, not a draft-inclusive snapshot.
- [ ] Implement environment-aware visibility from Korean original `devOnly`: published-only production preparation/snapshot, separate server-only local dev draft access, no translation override or environment/query/preview escape hatch. Inspect metadata in memory before serialization; never write draft bodies/records to production snapshot or raw-content caches.
- [ ] Update `src/constants/types.ts`; retain existing consumers while introducing localized result types.
- [ ] Update `src/constants/octokit.ts` only as necessary for ref-pinned shared fetch/error handling; keep credentials server-only.
- [ ] Replace `src/utils/getSlug.ts` API-URL parsing with tested unchanged basename mapping.
- [ ] Update `.gitignore` for build-local snapshot/staging files, generated sitemap and `public/{en,ja}/rss.xml` (`public/rss.xml` already ignored).
- [ ] Add section 6's compact shared fixtures for availability, source visibility, dates and representative preparation failures; keep policy tests at this layer rather than duplicating locale/page E2E combinations.

Acceptance: original content unchanged, no duplicate slugs, optional files harmless to routes, coherent build failure behavior, all existing identities proven equal; local dev can read draft details while production snapshots contain no draft records/bodies.

### T2 — Routes, detection and legacy migration

- [ ] Move/reuse `src/pages/index.tsx` content in `src/pages/[locale]/index.tsx`; replace root with SSR redirect.
- [ ] Move/reuse `src/pages/about/index.tsx` as `src/pages/[locale]/career.tsx`.
- [ ] Move/reuse `src/pages/blog/index.tsx` and `src/pages/blog/[slug].tsx` under `[locale]/blog/`; remove old content implementations once redirects are present.
- [ ] Add `src/i18n/{locales,routes,detect}.ts`: validation, localized URL helpers, weighted language parsing, validated cookie handling.
- [ ] Preserve Next.js 12.1.5 Pages Router and content SSG; add precise 308 redirects in `next.config.js`, root-only 307 detection, and no built-in i18n, Middleware, ISR or new infrastructure. Preserve feed file endpoints.
- [ ] Include draft locale detail paths only in local dev; exclude them from production SSG and enforce `notFound` for production detail/data requests. Keep legacy 308 behavior, ending at 404 for drafts in production. Wire local dev to loopback; no public preview route or draft-enable overrides.
- [ ] Include root cache/redirect wiring in section 6's automated HTTP and minimal deployment probes; do not add a separate routing E2E suite.

Acceptance: every existing public slug works in three locales; root 307 and legacy 308 are correct; explicit routes and non-page resources do not get detection redirects; local dev draft details work in three locales, while every production-built draft destination is 404.

### T3 — UI and fallback

- [ ] New `src/i18n/messages/{ko,en,ja}.ts` and read-only URL-derived locale hook/context if needed; no independent client locale state.
- [ ] New `src/components/layout/LanguageSelector.tsx` remains in T3: discoverable in shared desktop/mobile header, 한국어/English/日本語, visible URL-selected option, accessible label/keyboard/focus. Persist manual preference; preserve route/slug/query/fragment even when destination translation is unavailable. Update `Header.tsx`, `Navigation.tsx`, `Footer.tsx`.
- [ ] Update `src/constants/index.ts`, `src/utils/getMenuLink.ts`, `src/utils/getMetaInfo.ts` to use semantic route identities (`career`, not old route position assumptions).
- [ ] Update `src/utils/getDisplayDate.ts`, `src/components/post/PostMeta.tsx`, `PostCard.tsx`, `src/components/about/CareerMeta.tsx`.
- [ ] New `src/components/shared/TranslationUnavailableBanner.tsx`; wrap fallback documents/cards with language attributes.
- [ ] Audit `src/components/markdown/Anchor.tsx`: localize known same-site content links while preserving external links, fragments, mailto and resources; do not rewrite arbitrary hosts or file URLs.
- [ ] Localize homepage/static shared metadata and check desktop/mobile/focus layouts without unrelated redesign.
- [ ] Render local draft pages through the real detail/Markdown layout for typography and responsive inspection; retain URL-derived locale selection, translated draft content and Korean fallback banners. Keep drafts excluded from listings; add no public draft UI.

Acceptance: route-derived initial language, no content flash/hydration mismatch, accessible selector, correct Korean document fallback and unobtrusive indicators.

### T4 — Unified SEO and feeds

- [ ] New `src/lib/seo/{page,sitemap,rss}.ts` (or smaller equivalent modules) sharing the normalized snapshot and indexability policy.
- [ ] Update `PageMeta.tsx`, `_app.tsx`, `_document.tsx` for deduplicated metadata, canonical/alternates/robots, distinct locale RSS autodiscovery and initial/client language. Verify initial SSG `<html lang>` with a simple Next.js 12.1.5-compatible Document implementation before relying on client updates.
- [ ] Extend `scripts/prepare-content.ts` to generate sitemap and `public/rss.xml`, `public/en/rss.xml`, `public/ja/rss.xml` once from the same validated pinned snapshot using `rss`; remove listing getStaticProps filesystem side effects. Require complete output validation before Next build.
- [ ] Use one production-origin config module, e.g. `src/constants/site.ts`; avoid request-host canonical URLs and placeholder domains.
- [ ] Add/update `public/robots.txt` only in coordination with the existing upstream response; preserve `/rss.xml` and exact Korean GUIDs; verify all three feeds have RSS HTTP content types without locale redirects.
- [ ] Exclude drafts and all draft translations from all three feeds, sitemap, canonical/hreflang and public metadata/discovery; local draft detail rendering must not advertise canonical/alternate content URLs. Source devOnly always takes precedence over translation completion.
- [ ] Verify career coverage and reciprocal hreflang from one generated snapshot; enforce fixed `noindex,follow` for en/ja listings regardless of coverage. Update `Footer.tsx` and `PageMeta.tsx` for current-locale subscription/discovery without hreflang collisions.

Acceptance: raw initial HTML has the requested document language and correct SEO state; sitemap matches indexability; en/ja listings stay noindex; all three valid RSS feeds preserve stable identities/dates and have locale-specific discovery; no localized fallback indexed by policy.

### T5 — Focused verification and deployment preview

- [ ] Use the compact shared fixtures in section 6 for localization/visibility/SEO/RSS rules and availability/date transitions; add external translations/authoring documentation only within approved scope, never solely to satisfy test permutations.
- [ ] Run focused unit tests and existing lint/type checks; simulate the two representative preparation failures to prove safe termination and stale-output rejection.
- [ ] Confirm representative local next dev draft rendering; run **one production build**, then automated route/HTTP/raw-HTML, XML and artifact-leakage checks on next start. Compare expected published slugs, Korean historical GUIDs and build/request counts to T0.
- [ ] Perform the desktop/mobile browser smoke once, then the minimal preview deployment probe. Repeat only failed/changed checks; no extensive E2E infrastructure or routine repeated builds.

Acceptance: section 6 release-blocking gates pass, including draft privacy, published content, initial HTML language, stable feeds and SEO migration. Optional/deferred coverage does not block release; meaningful regressions are not silently waived.

### T6 — Approved release and monitoring

- [ ] Freeze/snapshot content ref and capture previous deploy, all available feeds, exact GUID/date inventories and upstream rules.
- [ ] Obtain Owner release approval with preview evidence and any unresolved hosting confirmations; draft visibility is settled.
- [ ] Release routing, localized HTML and SEO assets together; do not publish translations against an incompatible old loader.
- [ ] Reuse T5 preview evidence; immediately after release run only section 6's critical production probe for root/legacy routing, public and fallback content, draft 404, all three RSS feeds and canonical/noindex/sitemap behavior. Do not repeat artifact, unit or browser suites unless deployment introduces a failure.
- [ ] Submit/update sitemap in existing Search Console property; monitor crawl errors, redirect loops, index coverage and accidental fallback indexing. No promise of zero temporary ranking fluctuation.

### Optional improvements, excluded from required scope

- Reuse an existing deploy hook for external-content commits after confirming current workflow; establishing new infrastructure is outside this amendment.
- Verified trusted country fallback if hosting exposes it without new GeoIP infrastructure.
- Future editorial/SEO reconsideration of en/ja listing indexability requires Owner approval; no automatic coverage-based toggle.
- JSON-LD, broader accessibility/design improvements, toolchain modernization, framework security/version work as separately approved tasks. Built-in i18n, Middleware, ISR and additional infrastructure are excluded from this plan; three RSS feeds are required scope.

## 5. Migration matrix

Let `O` be the configured production origin (currently `https://danbileee.com`). “Eligible” always remains subject to approved publication rules. Redirect responses are not canonical content pages.

| Request | Expected response / destination | Final canonical | Final indexing |
| --- | --- | --- | --- |
| `/`, no preference, `ja-JP` | 307 `/ja` | `O/ja` | Homepage eligible; root selector excluded |
| `/`, cookie `en`, browser `ko-KR` | 307 `/en` | `O/en` | Homepage eligible |
| `/`, no supported language/no country | 307 `/ko` | `O/ko` | Homepage eligible |
| `/about` | 308 `/ko/career` → 200 | `O/ko/career` | Korean eligible |
| `/career` | 308 `/ko/career` → 200 | `O/ko/career` | Korean eligible |
| `/blog` | 308 `/ko/blog` → 200 | `O/ko/blog` | Korean eligible |
| `/blog/why-i-am-building-furigana` | 308 `/ko/blog/why-i-am-building-furigana` → 200 | Same final URL under `O` | Korean eligible |
| `/blog/my-post?utm_source=x` (existing slug) | 308 `/ko/blog/my-post?utm_source=x` | `O/ko/blog/my-post` | Korean eligible |
| `/ko/blog/my-post` | 200 Korean | Self | Eligible |
| `/en/blog/my-post`, valid en | 200 English | Self | Eligible, sitemap/hreflang |
| `/en/blog/my-post`, missing/invalid en | 200 Korean + English banner | Omitted | `noindex,follow`; no sitemap/hreflang |
| `/ja/blog/my-post`, valid ja, browser ko | 200 Japanese, no redirect | Self | Eligible, sitemap/hreflang |
| `/ja/blog/my-post`, missing/invalid ja | 200 Korean + Japanese banner | Omitted | `noindex,follow`; no sitemap/hreflang |
| `/en/blog`, `/ja/blog`, any coverage (including complete/empty) | 200 localized UI; all public cards translated or Korean fallback | Omitted | Fixed initial-release `noindex,follow`; no sitemap/hreflang |
| `/ja/career`, partial entry translations | 200 mixed complete entries + summary banner | Omitted | `noindex,follow` until full coverage |
| `/en/blog/unknown-slug` | 404 | None | Not indexable; not translation fallback |
| Local `next dev`: `/ko/blog/:draft`, `/en/blog/:draft`, `/ja/blog/:draft` | 200 local detail; translation or Korean fallback | None | No canonical/hreflang/discovery; no listing/feed/sitemap |
| Any production-built `/ko/blog/:draft`, `/en/blog/:draft`, `/ja/blog/:draft` | 404; no generated page/data/props | None | No draft artifacts or discovery |
| Legacy `/blog/:draft` on production build | 308 `/ko/blog/:draft` → 404 | None | Former draft access removed; no retained public draft page |
| `/rss.xml` | 200 Korean RSS, exact historical GUIDs, updated ko links | Not a content canonical | Resource endpoint, no locale redirect |
| `/en/rss.xml`, `/ja/rss.xml` | 200 valid localized RSS, including empty channels | Not content canonicals | Resource endpoints, no locale redirect/sitemap entry |
| Icons, `/_next/*`, `/api/*` | Existing response behavior; no locale redirect | As applicable | Resource-specific |
| `/sitemap.xml`, `/robots.txt` | Non-localized SEO responses | Not content canonicals | Never redirected by locale logic |

## 6. Risk-based verification and release gates

Target: implement and release within half a day, subject to the separate production approval and hosting compatibility gates. Keep all functional requirements above; section 5 describes expected behavior, **not an exhaustive E2E checklist**. Verify shared rules once with focused tests, then prove representative framework/deployment wiring. Do not multiply tests across every locale, page type, state and environment.

### Release-blocking verification

Use existing Yarn/TypeScript tooling and small scripts/assertions; no new E2E framework or dependencies unless an essential check cannot otherwise run. Complete lint/type checks against the recorded baseline. Privacy failures, wrong redirects/indexing, lost published content, inconsistent outputs and RSS identity changes block release; unrelated pre-existing warnings do not justify expanding scope.

| Check owner | Minimal evidence | Critical assertions |
| --- | --- | --- |
| Shared-logic unit tests | One compact fixture set: public original, valid en/ja translations, absent/invalid translation, and a Korean-source draft with a completed translation | Source-derived identity/visibility; missing/false devOnly publishes and true does not; translations cannot publish drafts; atomic Korean fallback; invalid translation non-fatal; draft→public and translation availability changes resolve correctly without repeated full builds |
| Shared routing/SEO unit tests | Table-driven locale detection and URL helpers plus SEO policy output | Regional/weighted language matching, invalid cookie/q=0 and Korean default; cookie priority; URL locale authority; slug/query/fragment preservation; article/career coverage rules; fixed en/ja listing noindex; reciprocal alternates/home x-default and correct production origin |
| Preparation reliability test | One transient fetch failure exhausted after retry, plus one malformed/incomplete source response; seed an old ready output before each attempt | Preparation exits unsuccessfully before next build; stale snapshot/partial feeds cannot become ready or be consumed. No need to enumerate timeout/403/429/5xx independently |
| RSS serializer unit tests | Generate all three feeds twice in memory from the same fixtures; one edit/date/availability change and one empty eligible-translation set | Translation-only en/ja items, valid XML, channel languages, stable locale-specific GUIDs and effective pubDates; optional date fallback/invalid-date handling; updates do not change identity; empty feeds valid. No extra Next builds |
| Local next dev check | One draft in ko, one available translation if present, and one fallback destination; normal listing and selector smoke | Draft detail 200 in actual layout with localized UI/fallback; excluded from public listing; local loopback only. Shared tests cover the other locale/state permutations |
| One production build + artifact checks | Build once after the dev check at a pinned content ref; scan build-owned output and compare published route set against the baseline | No draft records/bodies/paths in snapshot, prerender manifests, HTML/Next data/props, JS/maps or generated assets; no credential leakage; expected published slugs retained in three locales; initial HTML lang matches locale. Use unique draft title/body/translation markers in memory, not persisted raw draft fixtures in production output |
| Automated HTTP/raw-HTML on next start | Reuse that build: root detection/cookie/default samples, legacy routes, one public article across locales, home locale samples, representative career/listing/fallback and one unknown/draft route | Root 307; explicit URLs never detected away; old about/career/blog and every inventoried public blog URL directly 308 to Korean with final 200; one query-preservation sample. Draft localized URLs/representative Next data URL 404, even with one attempted preview/query override; unknown slug 404; sample static resource/SEO endpoints unredirected |
| SEO/feed artifact and HTTP checks | Parse generated sitemap, all three feed responses and representative initial page HTML in the same script | Exact historical Korean GUID/date/order compatibility with T0 capture; feed endpoints 200, valid RSS XML and RSS content type. Correct canonical origin/path; fallback and en/ja listing noindex without canonical/hreflang; translated article eligible where available; reciprocal indexable alternates; homepage x-default; sitemap equals expected indexable set, with no drafts/legacy/fallback/listing en/ja URLs. Locale RSS discovery is separate from hreflang |
| Focused browser smoke | One desktop session and one mobile viewport; one article language-switch sequence including a missing translation | Discoverable labeled selector, selected URL locale, keyboard/focus, route/slug/query/hash retained, cookie persists through refresh, fallback banner/body, footer feed destination, document language after navigation; no hydration error or content flash |
| Deployment preview / production smoke | Run the small deployment probe below; reuse the artifact evidence instead of repeating unit/browser suites | Detect host/CDN differences and confirm the released artifact remains safe |

Tests own distinct assertions: units cover parsing/policy/state transitions and repeated feed generation; artifact scans cover complete output privacy and route inventory; HTTP checks cover actual Next status/header/initial HTML wiring; browser smoke covers interaction/hydration; deployment probes cover host/CDN delivery. Check a policy again only when integration wiring or delivery adds a real failure mode. Do not rebuild solely for each translation/draft state; exercise those transitions in the loader/serializer fixtures. Repeat a production verification build only after a meaningful fix or failed gate. A provider's normal deployment build uses the same approved code/content ref and is not another permutation test run.

Draft verification is consolidated into four gates: **local next dev accessibility, production-built 404, automated artifact leakage scan, and published-content regression comparison**. Include the dev→build transition in the one build, use distinctive markers from existing drafts/isolated fixtures, exclude source/test files from artifact scans, and compare the public slug set rather than only searching for absent markers. Production filtering remains unconditional; a query/environment/preview option cannot enable draft serialization. Known historical draft URLs are recorded for the deployment probe, not a blocking exposure investigation. Shared visibility tests cover removal/false of devOnly; no second full build is required just to demonstrate publication eligibility.

Measure build time and GitHub request count once against T0; investigate unexpected per-locale refetching, not microbenchmark differences. Use the existing XML parser/tooling if available; any necessary parser dependency must be small and justified by essential XML validation. Do not deploy synthetic published test articles merely to complete a state matrix: use shared fixtures for unavailable live translation states and probe genuine content when available.

### Minimal deployment probe — release-blocking

Run against preview before approval and production immediately after approval, using the same small script:

- `/` twice with contrasting language/cookie preferences: 307 to the expected locale, no cross-visitor cached selection. If country fallback is enabled, add one trusted-country check; otherwise omit it.
- One legacy indexed article and `/about`/`/blog`: direct Korean 308 and final content 200. One explicit locale article, one translated article if available, one fallback and en/ja listings: content available, canonical/noindex correct in raw HTML. Full legacy inventory was already checked locally.
- One known draft in each locale and its legacy URL: localized 404 and legacy 308 ending at 404. Confirm production deployment uses a build/start workflow, not next dev; reuse full marker/route scans from the build gate.
- `/rss.xml`, `/en/rss.xml`, `/ja/rss.xml`: 200 with RSS content type and valid XML; historical Korean GUID mapping unchanged. Sitemap/robots: accessible, intended sitemap set, no draft/fallback/old URLs, crawl access permits noindex discovery.

Host routing, draft leakage, missing public content, incorrect feed identity and material SEO failures block activation or trigger the existing recovery procedure. Production checks are limited to these essentials, not a repeat of the full local suite.

### Optional or deferred verification — non-blocking

- Exhaustive locale × page × state × environment E2E runs, repeated full builds for adding/removing each translation, every GitHub status/error permutation, broad browser/device suites and extended screen-reader/typography audits.
- Additional malformed-header/query permutations, complete resource crawl, historical backlink investigation, long-running load/performance benchmarks and localized feed-reader compatibility comparisons beyond XML/identity checks.
- Long-term Search Console/index/ranking monitoring follows release; it is not a same-day pre-release test. Historical draft exposure evidence and unrelated baseline tooling issues do not reopen the finalized privacy decision.

Defer only extra coverage. Correct initial HTML language, local-only drafts, complete production artifact exclusion, stable feeds, SEO migration and all approved functional behavior remain required. No application implementation or runtime verification runs as part of this planning amendment.

## 7. Rollback and SEO recovery

Before release, preserve the previous deployment artifact, locked dependencies, external content SHA, all three generated feeds with per-locale GUID/effective-publication-date inventories, and Cloudflare/Vercel rules. Keep the locale-aware grouping loader independently deployable before routing activation if feasible.

Trigger rollback for redirect loops, root preference caching across visitors, material 404s on known posts, incorrect canonical origin, widespread incorrect noindex, content leaks, or build/deployment failures. For localized-page bugs after permanent redirects have shipped, prefer a forward fix or the last known good localized deployment that retains `/ko` and legacy redirects.

**Do not simply remove locale routes after shipping 308s.** Browsers/search engines can cache those destinations. If a full routing rollback is unavoidable, serve both old and locale URLs and remove conflicting forward redirects before adding any temporary recovery mapping. Never create `/blog/:slug → /ko/blog/:slug → /blog/:slug` loops. Coordinate canonical/sitemap changes in one release and confirm cached destinations still serve content.

An old-loader rollback must pin content to the pre-translation SHA or use a grouping-capable artifact; otherwise added `.en.mdx`/`.ja.mdx` files create duplicates even if application code is reverted. Restore all three RSS endpoints from a coherent known-good content snapshot/artifact, with exact Korean GUIDs and unchanged locale-specific GUIDs/dates. Once advertised, keep en/ja subscription endpoints available even if a pre-multilingual application artifact is needed; supply compatible validated localized feeds (empty if no eligible translations) without redirecting them to Korean. Never use a build-time date to repopulate historical items. Include discovery/footer links in rollback verification. Failed preparation must block new output rather than consume a stale snapshot. Rollback must preserve production draft exclusion unconditionally; an old draft-exposing artifact is not an acceptable rollback target, even if it predates this policy. Retain a published-only compatible artifact or fix forward. Public access must not be restored for historical draft links. Revert upstream changes separately if made, then run the critical deployment probe through Cloudflare and any check specific to the repaired regression.

For SEO regressions, correct HTML/redirects first, publish coherent sitemap, use existing Search Console diagnostics and monitor recovery. Preserve redirects long term while backlinks/bookmarks exist; do not repeatedly toggle permanent migration direction.

## 8. Owner decisions and external confirmations

Implementation details above are recommendations, not unresolved design placeholders. The table distinguishes remaining approvals/operational confirmations from finalized decisions:

| Decision | Options and trade-offs | Recommendation / impact |
| --- | --- | --- |
| T0–T5 implementation / T6 production release | Approve implementation scope, revise or defer; approve production release separately after verification. Migration changes indexed page URLs and adds root request-time handling | Plan is ready for T0–T5 approval; that approval does not authorize production deployment. No implementation begins in this amendment |
| devOnly visibility — finalized | devOnly true means development-only unpublished content; local next dev access required, production-built access prohibited | No additional Owner approval required. Implement local detail access and complete production artifact exclusion; historical exposure audit is non-blocking and former public draft URLs become 404 |
| Translations and external repo authoring | Add optional sibling files after loader release; postpone actual translations; use locale subdirectories instead. Siblings have lowest migration burden; directories need more mapping | Approve additive `.en.mdx`/`.ja.mdx` authoring convention; originals untouched. Actual content translation is optional and requires editorial ownership; all fallback routes still ship |
| Blog listing SEO — decided for initial release | ko indexable; en/ja fixed noindex,follow at every coverage level. Future indexing could remain disabled or be enabled after separate editorial/SEO review | No current coverage decision pending; do not auto-toggle. Translated articles remain independently indexable. Future change requires Owner approval; career full-entry rule unchanged |
| Content refresh workflow | Manual rebuild/redeploy or reuse an existing deploy hook. Manual is simplest but delays updates; an existing hook reduces delay | Confirm operational owner and current trigger; preserve build/redeploy without ISR or new infrastructure. Content, feed and SEO changes go live together only after successful deployment |

Required external confirmations: actual host build/runtime/static-export settings, upstream root caching/robots/redirect rules and production origin. These are verification gates, not reasons to upgrade; additional historical URL/index evidence is non-blocking. Country detection is omitted unless a trusted existing signal is confirmed, so lack of GeoIP access does not block implementation.

The architecture, development-only draft policy, initial listing noindex policy, header selector and three-feed scope are settled by the finalized Owner instructions; no additional RSS format or listing threshold decision is pending. Translation timestamps are optional with the deterministic compatibility fallback above. Technical risks are development-server exposure, draft leakage through stale dev/build artifacts or bypass flags, unintentionally filtering legitimate published posts, subscriber duplication if GUIDs change, feed reordering when dates are backfilled, routing/MIME interference for locale feed files, and stale/partial outputs after preparation failures; T0–T6 and rollback checks explicitly cover them. The revised plan is ready for T0–T5 implementation approval. Deployment compatibility confirmations remain technical gates; the seven-page exposure audit is non-blocking and no publication-policy decision remains. Owner approval should cover implementation scope and any external authoring work, with production deployment separately approved in T6; deployment findings may then refine narrowly scoped configuration work. The initial deliverable is complete when this plan is reviewed. **Wait for Owner approval before changing production code, external content, deployment configuration, or committing changes.**
