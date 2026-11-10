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

- Responsive cream and burgundy design with real 222 photography.
- Complete English and Greek UI, with a remembered language preference.
- Four accessible menu tabs with keyboard navigation.
- Photo gallery with native modal focus handling and arrow-key navigation.
- Direct Wolt ordering, Instagram, telephone and Google Maps links.
- Self-hosted fonts, reduced-motion support, social metadata and café structured data.

Content lives in `src/content.ts`; layout in `src/App.tsx`; styling in `src/styles.css`. Images and fonts are in `public/`. The source hosting manifest is `.openai/hosting.json`.

Venue and image sources are documented in `ASSET-SOURCES.md`; font sources and licenses are in `public/fonts/`. Menu selections reflect the merchant's Wolt listing as researched on 10 November 2026. Current prices and availability are handled by Wolt. Venue hours use a call link because third-party sources differ.

The uploaded files were used as project reference material. Their README setup instructions and AI Studio integration were not treated as new user requests; no Gemini integration is required for this café site.
