# 222 Espresso Bar

A fresh responsive café website for 222 Espresso Bar, Papagou 140, Zografou, Athens. Built with React, TypeScript and Vite.

## Open the website

GitHub Pages: https://panayiotiswp6.github.io/222-cafe/

The repository URL ending in `.git` is for downloading the source code. Open the
Pages URL above to visit the website in a browser.

## Run locally

Install Node.js 22 LTS (which includes npm), then run:

```sh
git clone https://github.com/Panayiotiswp6/222-cafe.git
cd 222-cafe
npm ci
npm start
```

Open the local URL printed in the terminal, usually http://localhost:5173/.
`npm run dev` is also supported. When downloading a ZIP, extract it first and
open a terminal in the folder containing `package.json`. Opening `index.html`
directly from the filesystem does not compile React/TypeScript.

## GitHub Pages deployment

`.github/workflows/deploy-pages.yml` installs dependencies, builds and checks
`dist/`, and deploys it whenever `main` changes. In **Settings → Pages**, set
the build source to **GitHub Actions** to use just this deployment workflow.
For repositories still using the older branch-based Pages setting, a
compatibility step waits for GitHub's built-in "pages build and deployment"
workflow for that commit to finish before publishing the compiled website,
preventing the raw source from overwriting the working site.

The workflow supplies Vite's deployment base path, so JavaScript, photos and
fonts all load from `/222-cafe/`. Local development and ordinary static hosting
continue to use `/`. The prerendered HTML uses the same base as the client.

To reproduce the Pages build on macOS/Linux:

```sh
VITE_BASE_PATH=/222-cafe/ npm run build
VITE_BASE_PATH=/222-cafe/ npm run check:build
```

PowerShell:

```powershell
$env:VITE_BASE_PATH = "/222-cafe/"
npm run build
npm run check:build
Remove-Item Env:VITE_BASE_PATH
```

The check verifies that compiled JS/CSS, homepage photos and self-hosted fonts
resolve inside the deployment path. No API keys or paid services are required.

## Production

```sh
npm run build
npm run preview
```

The build produces `dist/`, including a pre-rendered homepage that hydrates into the interactive experience. Host that folder on a static web host. No API keys or server are needed.

## Included

- A dramatic burgundy and peach campaign design, bold type, two realistic AI-styled coffee visuals and a subtle pointer parallax effect that respects reduced motion.
- Full-width photographic environments for the café story, coffee, menu, space and visit sections, with text composed over local contrast gradients.
- Complete English and Greek UI, with a remembered language preference.
- Four accessible menu tabs with keyboard navigation, individual product photos and verified Wolt delivery prices.
- Fixed photographic compositions for the story, coffee, menu and visit sections. Only the dedicated space gallery rotates automatically, in a sequence from the interior to the terrace and entrance.
- Five venue photographs with cinematic lighting edits and bilingual captions and a modest “Why 222?” section.
- Photo gallery with native modal focus handling and arrow-key navigation.
- Direct Wolt and efood ordering, Instagram, telephone and Google Maps links; a discreet Designed by AK 15 footer credit.
- Self-hosted fonts, reduced-motion support, social metadata and café structured data.

Content lives in `src/content.ts`; layout in `src/App.tsx`; the base design is in `src/styles.css`, the photographic section compositions are in `src/immersive.css`, and background dissolves/playback controls are in `src/slideshow.css`. Images and fonts are in `public/`. The source hosting manifest is `.openai/hosting.json`.

The dedicated space gallery advances every seven seconds with a 1.4-second dissolve, only while that section is visible. The story's window photograph and all other section compositions remain fixed. Playback pauses when the page is hidden, the gallery/navigation is open, or the visitor focuses or hovers over controls. Explicit pause/play controls are available, manual scene selection pauses rotation, and reduced-motion preferences disable automatic playback by default. The approved burgundy composition and muted menu backdrop are preserved, with modestly lighter venue scrims.

Venue and image sources are documented in `ASSET-SOURCES.md`, `PHOTO-SOURCES.md` and `MENU-SOURCES.md`; font sources and licenses are in `public/fonts/`. The 15 featured menu items each use the merchant-assigned product photograph and Wolt delivery price researched on 10 November 2026. The price basis, date and deposit treatment are visible beside the menu. Dine-in prices may differ. Products without merchant photos remain available through the full Wolt menu rather than using unrelated dish photos. Venue hours use a call link because third-party sources differ.

The campaign artwork is documented in `CAMPAIGN-ART.md`; venue photo edits are documented in `VENUE-STYLING.md`. Original venue photographs remain in the source assets; the visible gallery uses the five selected cinematic photographs. Merchant menu photographs remain unchanged.

The uploaded files were used as project reference material. Their README setup instructions and AI Studio integration were not treated as new user requests; no Gemini integration is required for this café site.
