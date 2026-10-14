# Typography implementation and verification

Date: 2026-10-14. T1–T5 essential checks passed. No production deployment performed; separate Owner approval remains required.

## Font asset

- Official [Google Fonts Noto Sans JP source](https://github.com/google/fonts/tree/66a36c8c94b1a5d992ee4e7f392fccfe4945767c/ofl/notosansjp), version 2.004-H2; SIL Open Font License 1.1 retained in `public/fonts/noto-sans-jp/OFL.txt`.
- One optimized variable WOFF2: **3,943,724 bytes** (source TTF: 9,589,900 bytes), weights 100–900. Offline subsetting retained Japanese glyphs and shaping features; no project/runtime dependencies added.
- WOFF2 decoding and essential Japanese sample coverage passed. No missing essential glyphs or additional font assets were required. Production asset response: HTTP 200, `font/woff2`, bytes identical to the local asset.

## Changes

- `src/styles/global.ts`: glyph-limited Noto Sans JP face and prose-font variables selected by existing root `lang` and CSS `:lang()`. Japanese pages use Noto for Japanese glyphs; Korean/English boundaries and embedded Latin retain Pretendard.
- `PostCard.tsx`: date now declares the requested locale with `lang={locale}`. Existing content-language article/card/career wrappers, code overrides, and icon assets remain intact.
- Next.js remains 12.1.5. Localization architecture, routing, and dependencies were preserved.

## Essential browser results

Actual rendered fonts were inspected manually by the Owner in Chrome DevTools and confirmed in this session; automated browser inspection supplied supporting CSS, route, and layout checks.

| Check | Result |
| --- | --- |
| Japanese UI | Passed: Japanese date characters use Noto Sans JP; Latin digits use Pretendard. |
| Japanese Markdown with embedded English | Passed: `日本語の React API と TypeScript を使います。` uses Noto Sans JP for Japanese and Pretendard for embedded Latin. |
| Korean fallback, including Han | Passed: `한국어 漢字 React API` uses Pretendard within `lang="ko"` on the Japanese fixture; genuine production fallback also confirmed. |
| Korean/English pages | Passed: Owner confirmed Pretendard and no Noto Sans JP requests on fresh loads. |
| Locale switching | Passed: `ko → ja → en` preserved article slug, query, and fragment; root/UI language updated and fallback retained Korean/Pretendard. No hydration errors observed. |
| Desktop/mobile layout and code/icons | Passed: no obvious regression; mobile document width and scroll width both 390px at 390×844. Inline code and syntax tokens retain monospace; heading SVG and footer icons remain functional. |

No genuine Japanese translations exist at the verified content ref. One temporary local snapshot fixture used the existing Article/Markdown renderer; it was removed before the production build. No external content was modified. Production HTML explicitly retains Korean fallback language on articles, cards, and career entries.

## Build and tests

- `yarn test:i18n`, `yarn tsc --noEmit`, and `yarn lint`: passed.
- One `CONTENT_REF=48192fe6b3209a166a265fffe992d3db75094745 yarn build`: passed on Next.js 12.1.5 with genuine content; temporary fixture route absent from the build.
- Focused local `next start` browser/HTTP checks: passed. The full multilingual E2E/SEO/RSS verification suite was not rerun, following the approved scope.
- Existing PnP peer/dependency, Browserslist, and lint warnings remain; no new blocking errors.

## Unresolved issues

No unresolved local release blockers. Production deployment remains subject to separate Owner approval.
