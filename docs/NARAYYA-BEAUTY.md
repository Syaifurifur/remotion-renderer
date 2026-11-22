# NARAYYA BEAUTY Remotion Template

This is an additional composition. The existing `MotionGraphic` composition remains available and is still the default for legacy requests.

## Render API

Send the existing `POST /render` payload plus:

```json
{
  "compositionId": "NarayyaBeauty",
  "branding": {
    "brandName": "NARAYYA BEAUTY",
    "tagline": "Glow beautifully, every day",
    "primaryColor": "#F4C6D7",
    "accentColor": "#C58B8A"
  }
}
```

If `compositionId` is omitted, the renderer selects `MotionGraphic` as before.

## Typography assets

Copy licensed WOFF2 files into `public/fonts/` with these exact names:

- `PlayfairDisplay-Regular.woff2`
- `PlayfairDisplay-Bold.woff2`
- `CormorantGaramond-Regular.woff2`
- `Poppins-Regular.woff2`
- `Poppins-SemiBold.woff2`
- `Allura-Regular.woff2`

Use the official Google Fonts repositories or another source whose license permits your use. Keep each font's OFL/license file alongside your asset when required. The font loader references local files; rendering does not depend on Google Fonts being reachable.

Until these font files are installed, CSS fallback fonts (Georgia, Arial, cursive) will be used.

## Update and deploy

1. Back up the current renderer/container configuration and confirm the active image/tag.
2. Merge this feature branch into your deployment branch after review.
3. Add the font files above under `public/fonts/`.
4. Build/test the project in the same Node/Docker environment used by the renderer. The repository currently exposes `start` and `studio`; run `npx tsc --noEmit` for TypeScript checking and start the service for render testing.
5. Rebuild/redeploy the Remotion Renderer app in Dokploy from the updated Git commit.
6. Check `GET /health`.
7. Submit a short test to `POST /render` with `compositionId: "NarayyaBeauty"`.
8. Test an existing request without `compositionId` to confirm it still renders with `MotionGraphic`.

## Rollback

Redeploy the previous known-good Git commit/image. The old `MotionGraphic` composition and default API selection are preserved, so clients that omit `compositionId` retain the previous visual template.

## Included components

- `src/branding/theme.ts`: palette and typography tokens.
- `src/branding/fonts.tsx`: local font-face declarations.
- `src/icons/NarayyaIcons.tsx`: reusable beauty SVG icons.
- `src/components/NarayyaMotion.tsx`: title, lower third, product card, CTA, floating petals, sparkle overlays.
- `src/NarayyaBeauty.tsx`: new vertical beauty composition.
