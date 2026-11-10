# 222 Espresso Bar

A fresh responsive café website for 222 Espresso Bar, Papagou 140, Zografou, Athens. Built with React, TypeScript and Vite.

## Run locally

```sh
npm ci
npm run dev
```

## Production

```sh
npm run build
npm run preview
```

The build produces `dist/`, including a pre-rendered homepage that hydrates into the interactive experience. Host that folder on a static web host. No API keys or server are needed.

## Included

- A dramatic burgundy and peach campaign design, bold type, two realistic AI-styled coffee visuals and a subtle pointer parallax effect that respects reduced motion.
- Complete English and Greek UI, with a remembered language preference.
- Four accessible menu tabs with keyboard navigation, individual product photos and verified Wolt delivery prices.
- Seven venue photographs with cinematic lighting edits, an Original/Cinematic comparison switch, bilingual captions and a modest “Why 222?” section.
- Photo gallery with native modal focus handling and arrow-key navigation.
- Direct Wolt ordering, Instagram, telephone and Google Maps links.
- Self-hosted fonts, reduced-motion support, social metadata and café structured data.

Content lives in `src/content.ts`; layout in `src/App.tsx`; styling in `src/styles.css`. Images and fonts are in `public/`. The source hosting manifest is `.openai/hosting.json`.

Venue and image sources are documented in `ASSET-SOURCES.md`, `PHOTO-SOURCES.md` and `MENU-SOURCES.md`; font sources and licenses are in `public/fonts/`. The 15 featured menu items each use the merchant-assigned product photograph and Wolt delivery price researched on 10 November 2026. The price basis, date and deposit treatment are visible beside the menu. Dine-in prices may differ. Products without merchant photos remain available through the full Wolt menu rather than using unrelated dish photos. Venue hours use a call link because third-party sources differ.

The campaign artwork is documented in `CAMPAIGN-ART.md`; venue photo edits are documented in `VENUE-STYLING.md`. Original venue photographs remain available through the comparison switch. Merchant menu photographs remain unchanged.

The uploaded files were used as project reference material. Their README setup instructions and AI Studio integration were not treated as new user requests; no Gemini integration is required for this café site.
