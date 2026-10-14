# Language-aware typography task plan

Date: 2026-10-14  
Status: Planning amendment only; verification simplified and ready for implementation approval. Application code and font assets have not been changed.  
Scope: Small typography follow-up to the existing multilingual implementation. Production deployment requires separate Owner approval.

## Intended behavior

Keep Pretendard as the default for Korean and English. On pages whose requested locale is `ja`, use Noto Sans JP for Japanese glyphs in Japanese-language UI and content. Latin text inside the same Japanese sentence must still render in Pretendard, without requiring an English wrapper around each word. Korean fallback content must use Pretendard, including shared Han characters within a Korean-language subtree. Preserve existing code/monospace and icon rendering.

Reuse the existing locale model: `requestedLocale` selects page/UI language, and `contentLocale` identifies the selected translation or Korean fallback. Page props currently expose the requested locale as `locale`. Keep routing, translation selection, dictionaries, SEO, content preparation, and locale switching unchanged except for any narrowly necessary language annotation.

## Repository findings

| Area | Existing behavior | Implication |
| --- | --- | --- |
| Framework | Pages Router; locked Next.js 12.1.5 | Use ordinary CSS and public font assets; no `next/font`, framework upgrade, or font-management library. |
| Global typography | `src/styles/global.ts` imports Pretendard dynamic subsets and Lato, then assigns the Pretendard stack to `*`, `*::before`, and `*::after` | A font override on `html` or `body` alone will not affect descendants. Adjust this existing rule locally. Preserve current imports. |
| Document language | `_document.tsx` sets `<html lang>` from page props; `_app.tsx` updates it on client navigation | Use this requested-language signal; no new locale store or detection logic. |
| Content selection | `src/lib/content/localize.ts` returns requested and content locales; missing/invalid translations select Korean | Font selection must follow the actual content language within the requested page. |
| Article | `src/pages/[locale]/blog/[slug].tsx` renders `<article lang={contentLocale}>` | Already produces explicit `lang="ko"` for fallback titles and body. Retain and verify. |
| Blog card | `src/components/post/PostCard.tsx` renders its link container with `lang={contentLocale}` | Already produces explicit Korean fallback boundaries. Its requested-language date currently lacks its own `lang`; annotate that date with `lang={locale}`. |
| Career | `src/pages/[locale]/career.tsx` renders each entry as `<li lang={contentLocale}>` | Already produces explicit Korean fallback boundaries. Keep per-entry language, including mixed translated/fallback lists. |
| Localized metadata | `PostMeta` dates and `CareerMeta` period already declare `lang={locale}` | Preserve these nested requested-language UI boundaries. |
| Code and icons | Global code rules and `markdown/Code.tsx` set monospace; link icons are SVG and footer icons are images | Keep their explicit font rules and assets intact; avoid a new broad rule that overrides them. |
| Translation evidence | Existing implementation report records no real Japanese/English article translations at its pinned content ref | Refresh inventory when implementing. Use a local translated-content fixture if Japanese articles remain unavailable. |

Existing migration documentation remains intact: [task-plan.md](./task-plan.md) and [implementation-report.md](./implementation-report.md). Prior verification results are historical; they do not certify this typography change.

## Tasks and acceptance gates

### T1 — Record baseline and prepare a Japanese WOFF2 asset

1. Select the verified content ref and one representative public article for checks. Note the existing Pretendard stack and preserve the workspace's uncommitted changes.
2. Obtain a pinned, licensed Noto Sans JP source from the [official Google Fonts directory](https://github.com/google/fonts/tree/main/ofl/notosansjp) or [official Noto CJK distribution](https://github.com/notofonts/noto-cjk/blob/main/Sans/README.md). Retain the required license beside the asset.
3. Prefer one optimized Japanese-region variable WOFF2 under `public/fonts/noto-sans-jp/`, supporting the site's normal weights, including 300–900. Use a simple offline subsetting/compression command only if needed; add no runtime dependency or font-processing pipeline.
4. Retain sufficient Japanese kana, Han, punctuation, and shaping/variation support for translated articles, beyond today's UI strings. Confirm essential sample glyphs and supported weights from the asset metadata and browser rendering; an exhaustive coverage audit is optional.
5. Measure the final asset size once and confirm successful WOFF2 loading/decoding in the focused browser check. Introduce multiple Unicode subsets only if actual measurements demonstrate a meaningful performance or coverage problem.

Release-blocking acceptance: official source and valid license, correct WOFF2 decoding, sufficient essential Japanese coverage, supported weights, and measured final size. No changes to package manifest, lockfile, or Next version are expected.

### T2 — Add glyph-limited CSS font selection

Implement in `src/styles/global.ts`, keeping existing style structure and code overrides:

1. Define `@font-face` for `Noto Sans JP` using the public WOFF2 URL, `format('woff2')`, normal style, the asset's actual weight range, `font-display: swap`, and an explicit `unicode-range`. Avoid `local()` so validation and delivery use the pinned asset.
2. Put Noto Sans JP before Pretendard only for effective Japanese-language text within `html[lang="ja"]`. Retain the exact existing Pretendard/system fallback stack elsewhere.
3. Use `:lang(ja)`, `:lang(ko)`, and `:lang(en)` for effective language, rather than a broad Japanese-page descendant selector. `:lang()` follows inherited language and respects nested language boundaries. See [Selectors specification](https://www.w3.org/TR/selectors-4/#the-lang-pseudo).
4. Recommended minimal mechanism: make the existing universal rule read a prose-font custom property with the current stack as its fallback. Set that property at the Japanese root, reset it for effective Korean/English descendants, and restore it for effective Japanese descendants. Gate those overrides under `html[lang="ja"]`; ensure equal specificity and correct ordering. This preserves nested Japanese UI inside Korean fallback content and responds to client-side changes of the root language.
5. Limit the Japanese face to supported kana/Han and selected Japanese punctuation ranges. Exclude ASCII, Latin letters (including accented/extended and full-width Latin), digits, Hangul, and private-use icon glyphs. Avoid broad ranges such as `U+0000-FFFF` or all of `U+FF00-FFEF`. Document the exact chosen ranges alongside the asset; intersect them with its character map.
6. Keep monospace and explicit component/icon font rules later or otherwise authoritative. Do not add a high-specificity `font-family` declaration to every Japanese descendant.
7. Serve the asset through existing Next public-file handling. Do not add unconditional preload; CSS should request the Japanese font when eligible glyphs are rendered. Verify loading on both direct visits and client navigation.

`unicode-range` restricts which characters a face can supply; the browser continues through the family stack for excluded characters. The descriptor does not physically subset the asset. Language boundaries are also required because Han code points are shared across languages. See [CSS Fonts specification](https://www.w3.org/TR/css-fonts-4/#unicode-range-desc).

Acceptance: Japanese glyphs use Noto Sans JP on requested-Japanese pages; Latin uses Pretendard within the same text node; Korean/English boundaries reset to Pretendard; cold Korean/English pages do not request the Japanese asset.

### T3 — Preserve explicit content language boundaries

1. Retain `lang={contentLocale}` on article, card, and career-entry containers. Assert actual server-rendered fallback markup contains `lang="ko"`; do not rely only on inherited Korean at the document root.
2. Add `lang={locale}` to the card date because its text is formatted with the requested UI locale. Preserve the equivalent existing annotations in article/career metadata.
3. Verify child Markdown headings, links, descriptions, and body paragraphs inherit the correct content language. Leave the unavailable-translation banner in requested-language UI scope.
4. Review the existing nested requested-language metadata annotations with the CSS rules. Add further annotations only if a focused check uncovers a real missing boundary; do not add language-boundary permutation tests.

Acceptance: Korean fallback articles, cards, and careers explicitly declare Korean and render in Pretendard; Japanese UI stays Japanese around and within them.

### T4 — Verify actual rendered fonts and layout in a browser

Use the following essential checklist for the single focused production-mode session in T5. A small browser DevTools inspection is sufficient: wait for fonts to load and inspect actual Rendered Fonts. Computed `font-family` alone is insufficient. Use CDP only if already available and convenient; do not build automated CDP infrastructure.

| Test | Required verification |
| --- | --- |
| Japanese UI | Japanese characters render using Noto Sans JP. |
| Korean fallback | Representative Korean content on a Japanese page renders using Pretendard, including representative shared Han characters. |
| Mixed Japanese/English | Japanese glyphs use Noto Sans JP while embedded Latin text uses Pretendard in the same sentence. |
| Korean/English pages | Existing Pretendard behavior remains unchanged; cold visits make no unnecessary Noto Sans JP requests. |
| Layout | No obvious clipping, overflow, or layout regression at one desktop and one mobile viewport (390×844). |

Use one representative mixed-language sample in Japanese Markdown content:

> 日本語の React API と TypeScript を使います。

Inspect the actual fonts supplying the Japanese and Latin portions, keeping the embedded Latin unwrapped by `lang="en"`. Use a genuine Japanese article if available. Otherwise, use one temporary local fixture with the existing translated-content shape and Article/Markdown renderer; include the mixed sample and a representative Korean Han sample in a `lang="ko"` fallback boundary if genuine content lacks one. Do not modify the external content repository or publish synthetic content. Keep the fixture separate from the genuine-content production build and remove it after verification; no extra fixture build is required.

The planned universal CSS change could affect code descendants, so retain one representative code/monospace and icon rendering check. Separate rendered-font inspection of every article, card, and career component is unnecessary; T3 retains their explicit markup checks.

Release-blocking acceptance: the essential rendered-font cases and desktop/mobile layout pass, essential Japanese glyphs are present, and existing code/icon rendering remains functional. Record a brief pass/fail summary; no glyph-count inventory or screenshot collection is required.

Optional or deferred: exhaustive glyph/weight checks, additional language-boundary permutations, broader browser/device matrices, font-network-failure simulations, detailed screenshots, CDP automation, and repeated performance measurements. These are not completion gates.

### T5 — Confirm production build and locale switching

After implementation, run the existing checks with the repository's locked Yarn/runtime setup:

```sh
yarn test:i18n
yarn tsc --noEmit
yarn lint
CONTENT_REF=<verified-content-ref> yarn build
```

Choose the verified ref before running; `<verified-content-ref>` is a placeholder. Stop any server using the same build directory before preparation/build: `prepare:content` removes `.next` and regenerates snapshot/feed assets. Run one production verification build unless a material issue requires corrective changes.

Start that genuine-content production build locally:

```sh
yarn start --hostname 127.0.0.1 --port 3000
```

Perform one focused production-mode browser/HTTP session:

- Confirm the Japanese font asset returns successfully and decodes without font errors.
- Complete the essential T4 checklist once, confirming Japanese UI, Korean fallback, Latin text, existing Korean/English typography, and desktop/mobile layout. If a temporary local fixture supplied Japanese Markdown evidence, reuse its result; do not rebuild with synthetic content or repeat that inspection.
- Switch the same article `ko → ja → en`, preserving its slug, query, and fragment. Confirm the root language and localized UI update, Korean fallback retains Pretendard, and switching works without hydration errors or requiring a reload.

T4 defines the inspection and T5 performs it on the production build; they are not two full browser passes. A separate development inspection is needed only for the temporary fixture or troubleshooting.

Keep existing automated checks intact. Do not rerun the entire multilingual E2E or SEO/RSS suite, including `yarn verify:i18n`, unless the typography implementation introduces a relevant regression. Do not add unrelated test coverage. Repeat affected checks only after material issues or corrective changes.

Release-blocking acceptance: production build, existing i18n tests, type checks, and lint pass on Next.js 12.1.5; the focused production session confirms font loading, required font behavior, responsive layout, and locale switching without hydration errors.

## Concise verification report

After implementation, create `typography-verification-report.md` containing only:

- Font source, license, and final asset size.
- Summary of CSS/component changes.
- Results of essential rendered-font checks, noting temporary fixture use if applicable.
- Build/test results, including the focused production smoke result.
- Any unresolved issues or release blockers.

Do not generate per-component evidence inventories or duplicate historical multilingual verification results.

## Expected change boundary

- `src/styles/global.ts`: font face and language-aware prose stack.
- `public/fonts/noto-sans-jp/`: optimized WOFF2 asset(s) and license.
- `src/components/post/PostCard.tsx`: requested-language date annotation.
- Existing article/career boundaries: preserve; change only if validation proves a missing annotation.
- This directory: plan and concise verification report; one temporary local fixture only if needed.

No localization architecture refactor, new runtime library, `next/font`, Next.js upgrade, routing/SEO redesign, or upstream content edits belong to this change. Existing code and icon fonts remain authoritative.

## Completion and release

The following are release-blocking completion criteria:

1. Japanese glyphs use Noto Sans JP on Japanese pages.
2. Korean fallback, including representative shared Han characters, and Latin text use Pretendard.
3. Existing Korean/English typography remains correct, with no unnecessary Japanese font requests.
4. No missing essential Japanese glyphs or broken font loading.
5. Existing code/icon rendering and responsive layout remain functional.
6. Production build, type checks, lint, and relevant existing tests pass.
7. Locale switching remains functional without hydration errors.

Implementation is complete when these criteria and T1–T5 essential acceptance gates pass, the concise report is recorded, and the diff stays within scope. Optional checks listed in T4 do not block completion. Restore temporary fixture outputs and retain a genuine-content verified build before handoff. If rollback is needed, revert only this typography patch/assets/date annotation while retaining the existing multilingual implementation.

The revised plan is ready for implementation approval; this amendment does not begin implementation. Production deployment remains a separate Owner approval gate after review of the concrete change and verification results. **No application implementation, build, font download, deployment, or runtime smoke check was performed during this planning-only amendment.**
