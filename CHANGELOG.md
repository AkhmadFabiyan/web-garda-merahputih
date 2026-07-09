# Changelog

All notable changes to the GARDA UNESA 2026 project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2026-07-03

### Changed
- **Social Gallery Refactor**:
  - Replaced local placeholder gallery images with official UNESA server URLs.
  - Configured Next.js `remotePatterns` in `next.config.ts` to allow blazing-fast native image optimization for `unesa.ac.id` domains.

### Fixed
- **Mobile Hero Background**:
  - Fixed an issue where the background emblem in the Hero section was too small on mobile screens (max-width: 480px).
  - Introduced `subtleFloatMobile` keyframe animation that scales the background emblem by 180% (`scale(1.8)`) for better visual impact on small devices without breaking desktop styles.

---

## [1.0.0] - 2026-07-03

### Added
- **Dynamic Lazy-Loading (`GardaChat`)**:
  - Implemented `next/dynamic` to load the AI Chat bundle only when the modal is opened, drastically improving initial page load times and saving bandwidth.
- **Next.js Edge Security (Anti-Spam)**:
  - Created `proxy.ts` (Next.js Middleware) to intercept API requests at the Edge level. Direct hits from cURL/Postman without valid referrers (`garda.unesa.ac.id` or `localhost`) are now instantly blocked with a `403 Forbidden`.
- **Advanced SEO & Open Graph Setup**:
  - Upgraded metadata in `layout.tsx` to include `keywords`, `twitter:card`, and `openGraph:images` pointing to the existing `icon.png`. Links shared to WhatsApp now generate beautiful rich preview cards.
- **Production Code Refactor**:
  - Translated all remaining informal Indonesian developer comments into professional English technical documentation.

---

## [0.9.4] - 2026-07-01

### Added
- **Smart Session Auto-Reset (`GardaChat`)**:
  - Implemented a graceful auto-reset mechanism. When a chat session reaches a maximum length of 20 messages (combining user and bot messages), Gara AI smoothly disables input, informs the user it is cleaning its memory, and resets the conversation to ensure optimal speed and prevent API hallucinations.
- **Accessibility UX Enhancement (`A11yWidget`)**:
  - Added "Click-Outside to Close" capability to the Accessibility Menu. Users can now simply tap anywhere outside the widget container to dismiss it, rather than being forced to click the close (✕) button.

---

## [0.9.3] - 2026-06-30

### Added
- **Contextual Memory Engine**:
  - Gara AI now features multi-turn conversation memory. The `intentDetector` intelligently looks back at recent history to inherit missing context (such as intent or faculty sub-context).
- **Advanced Markdown UI**:
  - The `GardaMessage` component now parses and renders bulleted lists (`-`, `*`) and headers (`###`) natively into proper HTML elements for beautifully structured AI responses.
- **Copy to Clipboard UX**:
  - Added a responsive Copy button to all AI message bubbles allowing users to instantly copy answers (turns green upon successful copy).

### Changed
- **Dynamic Follow-up Suggestions**:
  - Follow-up suggestion chips are now context-aware. E.g., "Siapa CP untuk fakultasku?" automatically transforms to "Siapa CP FIP?" if the current user context is resolved to FIP.
- **OpenRouter Models Reversion**:
  - Reverted OpenRouter models strictly to `openai/gpt-oss-120b:free`, `qwen/qwen3-next-80b-a3b-instruct:free`, and `nvidia/nemotron-3-nano-30b-a3b:free` as requested by the user.

### Fixed
- **RAG Hallucination (Stop Words)**:
  - Fixed a critical bug where basic pronouns (like "kamu") triggered the RAG vector search to falsely inject Twibbon FAQ context into the prompt. Added a robust Stop-Words filter (20+ terms) to the knowledge search engine.
- **Identity Fallback (`Siapa kamu?`)**:
  - Fixed a missing response hook in `SMALL_TALK` where asking the AI's identity would default to a random confirmation reply. It now answers with its designated persona gracefully without hitting the LLM.
- **AI Outage Crash Resilience**:
  - Fixed an edge case where a total failure of both OpenRouter and Gemini Direct would silently fall through to a generic "Contact Person" UI error. The bot now explicitly communicates network failures (`GEMINI_ERROR_RESPONSE`).

---

## [0.9.2] - 2026-06-30
- **UI Grid Blowout (PreFooter & Contact Person)**:
  - Fixed an issue where the Contact Person column forced its minimum width and blew out the grid layout on medium desktop screens, causing the "Ikuti Kami" section to overflow the container padding.
  - Implemented `minmax(0, 1fr)` on the `PreFooter` grid to prevent container expansion.
  - Reduced paddings, gaps, and font sizes within the `ContactCard` to perfectly fit the 3-column layout inside the constrained wrapper.
  - Reduced padding on the WhatsApp button (`waBtn`) to prevent text spillover.
- **AI Nickname Inconsistency**:
  - Replaced remaining legacy references of "AI Garda" with "AI Gara" in the Syarat & Ketentuan page.

### Changed
- **Codebase Standardization & Cleanup**:
  - Renamed `src/app/~offline` route folder to `src/app/offline` to adhere to standard PWA routing conventions and eliminate the tilde prefix.
  - Renamed `Terms.module.css` in `/syarat-ketentuan` to `page.module.css` for consistent Next.js CSS Module naming conventions.
  - Removed an empty/duplicate `src/services` root folder (canonical services are located in `src/lib/services`).

---

## [0.9.1] - 2026-06-26
- **AI Preprocessor Layer**:
  - Implemented `preprocess.ts` to normalize 30+ common typos, PKKMB abbreviations (`pk2mb`, `presns`, `tgs`, `drscd`), and informal shorthand (`gmn`, `kpn`, `tlg`) before intent detection.
- **Smart Small Talk Engine**:
  - Added `SMALL_TALK` intent to handle greetings, thanks, and basic confirmations locally with rotating static replies. Zero Gemini calls for basic chat.
- **Follow-up Suggestions UI**:
  - Added tappable `suggestionChip` UI below AI responses to guide users on what to ask next based on their current intent.
- **Dual-Provider AI Routing**:
  - Rewrote `gemini.ts` to support both OpenRouter (`OPENROUTER_API_KEY`) and direct Gemini (`GEMINI_API_KEY`) with seamless fallback if one encounters a rate limit.
- **Off-Topic Blocker**:
  - Expanded `OFF_TOPIC` patterns to block questions about weather, politics, recipes, gaming, etc., saving tokens for relevant queries.

### Changed
- **Knowledge Search Threshold**:
  - Lowered exact-match bypass threshold from `score >= 5` to `score >= 3` to aggressively answer from local data instead of calling the generative model.
- **Creative Mode Optimization**:
  - Separated creative requests (pantun, puisi) from factual ones. Creative requests bypass cache, use `temperature: 0.65`, and receive a specialized system prompt enforcing strict AABB/ABAB rhyme structures.
- **Link Registry Expansion**:
  - Expanded `findLinkByKeyword` from 4 to 10+ keyword groups, adding direct URL responses for Jadwal Lengkap, Pengumuman, Syarat & Ketentuan, FAQ, dan Daftar CP.
- **Cache Normalization**:
  - Cache keys now strip punctuation and collapse whitespace, drastically increasing cache-hit rates for duplicate questions like *"Jadwal PKKMB?"* and *"jadwal pkkmb"*.

---

## [0.9.0] - 2026-06-26

### Added
- **Animated Flag Background (Hero)**:
  - Added waving flag CSS animation as Hero section background for thematic visual identity.
- **Font Preconnect & LCP Preload**:
  - Added `<link rel="preconnect">` for `fonts.googleapis.com` and `fonts.gstatic.com` in `layout.tsx` to reduce render-blocking font delay.
  - Added `<link rel="preload" as="image">` for `hero-emblem.png` so the browser's preload scanner discovers the LCP image earlier.
- **Timeline Page (Jadwal) — Full Redesign**:
  - Replaced flat card list with a proper vertical timeline layout featuring a red gradient connector line.
  - Added color-coded node icons per status: `▶` ongoing (red), `✓` done (green), `○` upcoming (gray).
  - Added status-aware card backgrounds: red tint for ongoing, green tint for done, white for upcoming.
  - Added animated pulse badge for `Sedang Berlangsung` status.
  - Added left accent bar (5px) per card matching status color.
  - Replaced inline-style info rows with structured `infoGrid` component.
- **Loading Skeleton Fix**:
  - Fixed route transition flash-to-gray by correcting `loading.module.css` background from `#1F2937` to `#FFFFFF`.
  - Fixed `skeletonHeader` dark gradient to match the site's white theme.

### Changed
- **SplashScreen Performance Optimization**:
  - Reduced SplashScreen duration from 2000ms to 1000ms total (fade starts at 600ms).
  - Removed two heavy infinite-loop animations (`pulse` + `float`) that ran during the critical first second.
  - Replaced with a lightweight one-shot `fadeIn` entrance animation.
  - Changed `slideRight` loader animation from `left` property (layout-triggering) to `transform: translateX()` (GPU-composited).
  - Added `will-change: transform` to loader progress bar.
- **Hero Section Mobile UX**:
  - Secondary button ("Info Garda") border changed from near-invisible `rgba(0,0,0,0.1)` to solid `#D1D5DB` + subtle shadow.
  - Mobile button height increased to `52px` with `font-size: 15px` for better touch targets.
  - Added `gap: 12px` between stacked mobile buttons.
  - Description text color darkened from `#A0AEC0` to `#6B7280` for better readability.
  - Countdown label changed to red uppercase with `font-weight: 800`.
  - Countdown card border thickened, shadow strengthened.
  - Tablet gap reduced from `64px` to `40px`.
- **Hero Emblem Animation**:
  - Added `will-change: transform` to `.heroEmblem` to promote it to a compositor layer and eliminate non-composited animation Lighthouse warning.
- **Garda AI — Anti-Hallucination Hardening**:
  - `temperature` lowered from `0.4` to `0.1` to drastically reduce model improvisation.
  - `max_tokens` reduced from `1024` to `600` to prevent long rambling answers.
  - `top_p` reduced from `0.9` to `0.85`.
  - System prompt fully rewritten with explicit `RULE 1–3` structure using visual separators for stronger model instruction-following.
  - Added mandatory fallback phrase (word-for-word) the model must use when data is not found.
  - Added explicit `✗` forbidden list: "biasanya", "umumnya", "kemungkinan", "mungkin", "seharusnya" when answering facts.
  - Added guard in `route.ts`: `GENERAL` intent with zero local context chunks now returns fallback directly without calling Gemini — closes the main hallucination vector.
- **Contact Data**:
  - All 24 placeholder phone numbers across 12 faculties replaced with `08XXXXXXXXXX` pending real CP data.
- **Intent Detector**:
  - Updated FAQ pattern from `glory of education` to `jayantara nuswantara` to match 2026 theme.
- **Gemini HTTP-Referer**:
  - Changed hardcoded `localhost:3000` to `process.env.NEXT_PUBLIC_SITE_URL ?? 'https://garda.unesa.ac.id'` for production correctness.

### Fixed
- **ESLint — `react-hooks/set-state-in-effect` (2 violations)**:
  - `OfflineBanner.tsx`: Rewrote using `React.useSyncExternalStore` (React 18 canonical API for external state subscription) — eliminates both the lint error and hydration mismatch simultaneously.
  - `RenderOnScroll.tsx`: Rewrote using `useState` lazy initialiser function for hash-based initial render — eliminates lint error without changing behavior.
- **TypeScript**: All checks pass — 0 errors.
- **ESLint**: All checks pass — 0 errors, 0 warnings.

---

## [0.8.0] - 2026-06-16

### Added
- **Syarat & Ketentuan Page**:
  - Added new `/syarat-ketentuan` route detailing the Privacy Policy, Rules, and AI Disclaimer for the GARDA UNESA 2026 portal.
- **Native Image Optimization**:
  - Integrated `sharp` for blazing fast C++ based native WebP image optimization, resolving 10+ seconds Next.js runtime delays on large payloads.
- **Interaction-Driven Hydration (Zero TBT)**:
  - Created `DelayedMount` component to strictly defer heavy React components (like Garda AI and A11y Widgets) until scroll/interaction. This drastically slashes the Total Blocking Time (TBT) and Main Thread Work in Lighthouse.

### Changed
- **Contact Section Refactor**:
  - Upgraded the CSS-only accordion logic in Contact Person to a fully controlled React state for better UX (opening one tab closes the other).
  - Increased touch target padding and font sizing for WhatsApp links on mobile devices.

### Removed
- **Navigation Cleanup**:
  - Removed obsolete "Dokumentasi" anchor link from the footer section.

---

## [0.7.1] - 2026-06-16
- **Dead Links & UI Jump Bugs**:
  - Replaced `/info` with `/#info-garda` in Quick Access to prevent 404 errors.
  - Replaced 24 instances of `href="#"` in `info.ts` with `/#info-garda` to prevent page jump behaviors.
  - Replaced the empty `#` hash link on the "Dokumentasi" footer item with a proper `/#galeri` anchor link.
  - Added the `id="galeri"` attribute to the `SocialGallery` component to provide a reliable anchor target.
- **Production Build Error**:
  - Fixed Next.js 16 Webpack compiler conflict by appending `--webpack` flag to `npm run build`.
  - Fixed TypeScript type error by removing unsupported `skipWaiting` property from `next-pwa` configuration.

---

## [0.7.0] - 2026-06-16

### Added
- **Progressive Web App (PWA) Support**: 
  - Integrated `@ducanh2912/next-pwa` for robust Next.js App Router compatibility.
  - Added `manifest.json` with official GARDA UNESA identities, theme color (`#0A0616`), and icons.
  - Added PWA-ready meta tags (`apple-touch-icon`, `appleWebApp.capable`, `themeColor` in `viewport`).
  - Website can now be installed as an application on Android, iOS, and Desktop Chrome/Edge.
- **Smart Voice Mode (Talkback V2)**:
  - Added intelligent click target interception. Talkback now correctly prioritizes reading exact text targets (`<p>`, `<h1>`-`<h6>`, `<span>`, `<label>`, `<button>`, `<a>`) rather than mistakenly reading the entire layout wrapper.
  - Removed fallback "Bagian konten utama" message which previously caused false positives.
- **Dummy SVG Icons**: 
  - Added placeholder SVG icons for `perizinan.svg`, `penugasan.svg`, `presensi.svg`, `pendataan.svg`, and `twibbon.svg` to prevent 404 Not Found errors in the console.

### Changed
- **Accessibility Improvements (A11y)**:
  - Implemented strict `role="button"` and `tabIndex={0}` semantics for interactive elements.
  - Configured global `:focus-visible` styles to enhance keyboard navigation outline visibility.
  - Integrated `aria-live="polite"` inside Garda Chat and typing indicators for screen readers.
  - Improved `A11yWidget` event handling using `{ capture: true }` delegation to prevent unnecessary React re-renders and logic duplication.
- **Next.js 14 Compatibility**:
  - Moved `themeColor` from `metadata` export to `viewport` export inside `layout.tsx` to clear Next.js hydration warnings.

### Fixed
- Fixed bug in Talkback engine where tapping an element inside a `<section>` bubbled up the event listener and triggered the generic Section Summary instead of reading the specific text.
- Fixed Service Worker crash (`Response body is already used`) during development Hot Module Replacement (HMR) by ensuring standard PWA implementation and clean state.

---

## [0.6.0] - 2026-06-12
### Added
- Initial UI release for GARDA UNESA 2026.
- Implementation of the Magical Dark Theme (Glory of Education).
- Integration of the AI Assistant Engine (Garda AI).
- Basic Accessibility (A11y) options panel.
