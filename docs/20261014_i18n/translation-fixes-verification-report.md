# Translation validation fixes

Date: 2026-10-15. Implemented and verified locally; hosted preview was not redeployed.

## Changes

- Metadata-only career translations are accepted when the Korean original also has no body after trimming whitespace. Careers with original details and all blog translations still require translated bodies. Required localized metadata, locale and completion status remain validated.
- Blog translations may override `ogImage` with a non-empty string. Omitting it inherits the original image. Localized images reach article OG/Twitter metadata and RSS enclosures through the existing consumers.
- Invalid translations remain non-fatal and select the whole Korean original. Build warnings now identify the filename and controlled validation reason. Parser errors omit YAML excerpts; unknown shared-field names are redacted.
- Updated the application translation-policy documentation. External content files were not changed.

## Verification

| Check | Result |
| --- | --- |
| `yarn test:i18n` | Passed, including metadata-only English/Japanese careers, whitespace-only bodies, required fields/status/locale, missing detail bodies, localized/inherited OG images, invalid images, shared-field conflicts, atomic fallback and sanitized diagnostics |
| `yarn tsc --noEmit` | Passed |
| `yarn lint` and `yarn eslint scripts/test-i18n.ts` | Passed with existing application/PnP warnings |
| `CONTENT_REF=be544a5d65629e099f76d7720e1636bf5cd30425 yarn build` | Passed; prepared 18 public posts and five public careers with 44 GitHub requests |
| Generated production artifacts | Verified Korean/English/Japanese article frontmatter and bodies, content language, OG/Twitter images, robots metadata, Tsunagaru career descriptions and empty bodies, RSS titles/enclosures, and localized article/career sitemap inclusion |

The real `tsunagaru.en.mdx`, `tsunagaru.ja.mdx`, `why-i-am-building-furigana.en.mdx` and `why-i-am-building-furigana.ja.mdx` files were accepted without content edits. At the pinned commit all five public careers have valid English/Japanese translations, making both localized career pages indexable. The translated article pages are also indexable and use their respective `-en.png` and `-ja.png` images.

Existing warnings concern PnP peer dependencies, outdated Browserslist data, `dangerouslySetInnerHTML` and existing explicit `any` types; no new lint/type/build errors remain. The hosted preview still needs a rebuild/redeployment of the updated application using content that includes these translations.
