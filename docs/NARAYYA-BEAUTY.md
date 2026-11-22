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

The repository stores licensed TTF font files in this structure:

- `public/fonts/Allura/Allura-Regular.ttf`
- `public/fonts/Cormorant_Garamond/static/CormorantGaramond-Regular.ttf`
- `public/fonts/Playfair_Display/static/PlayfairDisplay-Regular.ttf`
- `public/fonts/Playfair_Display/static/PlayfairDisplay-Bold.ttf`
- `public/fonts/Poppins/Poppins-Regular.ttf`
- `public/fonts/Poppins/Poppins-SemiBold.ttf`

The font loader references these local TTF assets through Remotion's `staticFile`. Keep the corresponding OFL/license files in the repository as provided with the font packages.

## Update and deploy

1. Back up the current renderer/container configuration and confirm the active image/tag.
2. Merge this feature branch into your deployment branch after review.
3. Confirm the six font assets above are present in the repository.
4. Build/test the project in the same Node/Docker environment used by the renderer. Run `npx tsc --noEmit` for TypeScript checking and start the service for render testing.
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
