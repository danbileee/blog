# T0–T5 implementation and local verification

Date: 2026-10-14. Production has not been deployed. Owner requested local verification only and will manage deployment.

## Implementation

- Explicit `ko`, `en`, and `ja` Pages Router routes retain Next.js 12.1.5, SSG, existing published slugs, and the existing Markdown renderer. Root-only SSR detects a validated manual cookie, then weighted supported browser languages, then Korean; it preserves queries and sends private/no-store and Cookie/Accept-Language Vary. Trusted country detection is omitted.
- Precise permanent redirects cover `/about`, `/career`, `/blog`, and one-segment legacy article URLs. Static files, all three feeds, API/framework resources, sitemap, and robots remain unprefixed resources.
- One commit-pinned, bounded-concurrency source preparation writes a published-only server snapshot, sitemap, and three RSS files. Failed preparation invalidates readiness and removes partial/stale generated output. Build preparation removes only build-owned `.next` output to prevent development artifacts surviving a build.
- Korean source frontmatter controls identity, shared metadata, and publication. Translation siblings are grouped; complete translations render atomically. Absent/invalid translations render the Korean original with requested-language UI. Publication timestamps are optional and deterministic. Orphans are ignored with sanitized diagnostics; source/fetch failures block preparation.
- Draft access is compiled from Next's actual development-server phase. Production snapshots exclude draft records/bodies and skip draft translations. Production detail/data requests cannot enable drafts with query, preview, or environment flags. `yarn dev` binds to loopback; its draft reads remain process-local at the snapshot ref. Local draft metadata omits canonical, hreflang, OG URL, and RSS autodiscovery. Analytics/widget execution is disabled in development.
- Shared localized header/footer, native labeled selector, homepage text, dates, navigation and known same-site Markdown links use URL/page-prop locale. Manual selection persists a host-only preference cookie and preserves article, query, and fragment. Initial HTML and client navigation set the document language; Korean fallback containers declare Korean.
- One SEO policy serves page metadata and sitemap. English/Japanese listings always remain noindex; fallback articles and partial careers omit canonical/hreflang. Eligible siblings have reciprocal alternates; homepages include root x-default. Feed discovery/subscription uses the requested locale.
- Korean RSS GUIDs retain exact historical values **and `isPermaLink=true`**, dates, and ordering. English/Japanese feeds contain only valid translations and currently have empty valid channels. All feed responses use RSS MIME type. Sitemap and robots preserve the observed upstream comments and add crawl/sitemap directives.

Compatibility fixes were limited to preserving an existing metadata-only Korean career entry and an empty-body draft, removing unsupported Next 12 `transpilePackages` configuration (rendering/build succeeded without it), and making the React title one text child. Complete-body validation still applies to new translations and published articles.

Dependencies: one small pinned `sax@1.4.1` XML parser validates every preparation on Node-only hosts; no test framework, framework upgrade, infrastructure, or content-repository edits. All previously locked dependency versions remain unchanged. Its Yarn cache and PnP/lockfile updates accompany the change. Python's standard-library parser is used only by local verification scripts.

## Baseline and results

Pinned content: `danbileee/blog-docs@48192fe6b3209a166a265fffe992d3db75094745`. Ref refreshed during implementation and unchanged from the plan. Inventory: 18 public posts, seven draft posts, five public careers, one draft career, no actual English/Japanese translations. Existing Korean RSS was captured completely in `rss-baseline.json` before implementation. Canonical origin remains `https://danbileee.com`.

| Gate | Evidence |
| --- | --- |
| Focused shared fixtures | Passed: grouping, original visibility (omitted/false/true/invalid flag), atomic valid/missing/invalid translations, draft-to-public and translation-availability transitions, language detection, URL/link preservation, SEO eligibility/reciprocity, stable localized feed dates/GUIDs, empty feeds and XML |
| Preparation reliability | Passed: seeded stale readiness/feed cannot survive exhausted transient retries or incomplete inventory; coherent outputs become ready only after validation |
| Type/lint | `yarn tsc --noEmit`, `yarn lint`, and script ESLint passed with no errors; existing integration/any-type and PnP peer/Browserslist warnings remain |
| Actual local development | Draft detail rendered through normal layout; English fallback/UI and draft exclusion from the 18-card listing verified. Corrected draft raw HTML verified in memory with no discovery metadata |
| Production build | Passed at pinned ref, 63 locale content pages plus root SSR and framework 404. Initial preparation resolved HEAD once (33 requests); pinned production preparation used 32 requests, independent of locale page count. Final preparation: 3444 ms / 32 requests; Next build: 15.11 seconds |
| Production artifact privacy | Passed: snapshot, manifests, HTML, Next data, JS/maps, cache and generated SEO assets scanned using draft titles/body markers held only in memory plus the configured token; expected public route set compared against all 18 historical slugs |
| Production HTTP / SEO / feeds | Passed: root 307/cache/preference samples; all 18 legacy article redirects and about/career/blog direct 308 + final 200; query preservation; explicit locale authority; sample article/home/career/listing SEO; unknown/draft/Next-data 404 including preview/query attempts; resource endpoints; exact sitemap set; XML/MIME and historical RSS identity/date/order |
| Browser desktop/mobile | Korean→English→Japanese article sequence preserves slug/query/hash; fallback/banner/content language, localized feed link, selected URL locale, refresh, and subsequent root cookie preference verified. 390×844 mobile layout has no horizontal overflow. Visible keyboard-focus outline verified; no hydration errors observed |
| Deployment probe script | Passed against local `next start`; hosted preview/production runs remain Owner work |

Three production builds were run: the initial verification build and two repeats after material corrections. Final review corrected local draft OG URL/discovery metadata and optional translated-tag/category validation (malformed optional fields now cause atomic fallback rather than a render/build failure). These repeats followed the risk-based exception for meaningful failed gates. No builds were run for translation/draft fixture permutations. No historical baseline build timing/request logs were available, so no comparative performance improvement is claimed.

Generic AxiosError messages were observed through the existing React DevTools/integration hook. No hydration mismatch was observed; the existing third-party integration is retained in production. Native computer-control permission was unavailable: the semantic native select and visible keyboard focus were inspected, but trusted native-key selection could not be completed. Owner should do that one manual check before activation.

## Owner handoff and release gates

Repository implementation and automated local reliability/privacy/SEO gates are complete. **Ready for Owner deployment validation; not yet cleared for production activation.** No unresolved automated local release blocker remains; the manual keyboard and hosted delivery gates below remain open. Before production activation, complete:

1. A native keyboard-only language selection in a browser (focus/select/commit), since computer-control permission prevented this final interaction check.
2. Confirm the host runs locked Yarn dependencies and `yarn build`/Next server workflow, has the server-side GitHub credential, uses a compatible Node runtime (local verification uses Node 22.18.0), and does not override preparation or use static export/next dev.
3. Confirm Cloudflare/Vercel root caching respects no-store and Vary, direct legacy routing has no upstream loop/chain, and upstream robots delivery retains policy plus the sitemap declaration. Local robots output cannot prove upstream ownership/delivery.
4. Run the minimal probe against the preview artifact built at the same content ref, then get separate Owner production approval. Run the same probe immediately after activation.

```sh
yarn test:i18n
yarn tsc --noEmit
yarn lint
CONTENT_REF=48192fe6b3209a166a265fffe992d3db75094745 yarn build
yarn start --hostname 127.0.0.1 --port 3000
yarn verify:i18n http://127.0.0.1:3000
# From a workspace containing the corresponding prepared snapshot:
yarn probe:deployment https://YOUR_PREVIEW_HOST
yarn probe:deployment https://danbileee.com
```

The probe uses Python 3 only on the verification machine; deployment preparation uses Node/SAX. Do not run `prepare:content` against a live local server: preparation owns/removes `.next` and generated assets. Deploy pages/feeds/sitemap together after a complete successful build. Never deploy `.cache/i18n/content.json` as a public asset.

Content refresh remains rebuild/redeploy. No existing deploy hook or hosting dashboards were available; Owner owns the trigger and upstream checks. Actual translations are optional and absent; fixture evidence covers their policies without publishing synthetic articles. Author sibling translations only after the grouping-capable deployment is available, using the approved frontmatter convention. Keep their first translation publication timestamps stable.

For release, retain the provider's previous deployment/configuration and this pinned verified localized artifact plus all three feeds. Historical exposure/Search Console/backlink auditing remains non-blocking. Do not roll back to an artifact that exposes drafts or remove cached `/ko` destinations after 308 migration; retain localized routes/feeds and fix forward or use a published-only compatible artifact, following the approved recovery plan.
