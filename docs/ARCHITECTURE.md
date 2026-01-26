# TANGO MAGENTA — System Architecture Report

> Technical documentation for system architects.
> Last updated: 2026-01-26

---

## 1. System Identity

| Property | Value |
|----------|-------|
| **Name** | TANGO MAGENTA |
| **Type** | Static PWA (Studio-Broadcast System) |
| **Hosting** | GitHub Pages |
| **Domain** | `dtslib1979.github.io/tango-magenta` |
| **Language** | es-AR (Argentine Spanish) + ko (Korean bilingual) |
| **Max Width** | 430px (Mobile-Only) |
| **Service Worker** | None |

---

## 2. Tech Stack

```
┌─────────────────────────────────────────────────────┐
│                    PRESENTATION                      │
├─────────────────────────────────────────────────────┤
│  HTML5 (Semantic, SEO, Schema.org LocalBusiness)    │
│  CSS3 (Custom Properties, BPM-synchronized timing)  │
│  Vanilla JS (ES6+, No framework, No build step)     │
└─────────────────────────────────────────────────────┘
                          │
┌─────────────────────────────────────────────────────┐
│                    DESIGN SYSTEM                     │
├─────────────────────────────────────────────────────┤
│  tango.css         → Token-based design system      │
│  body-protocol.js  → Touch/scroll interaction layer │
│  entrada.js        → Ritual entrance sequence       │
└─────────────────────────────────────────────────────┘
                          │
┌─────────────────────────────────────────────────────┐
│                    DATA LAYER                        │
├─────────────────────────────────────────────────────┤
│  FACTORY.json   → Core system configuration         │
│  branch.json    → Franchise OS identity             │
│  api/*.json     → Content endpoints (static)        │
└─────────────────────────────────────────────────────┘
                          │
┌─────────────────────────────────────────────────────┐
│                    EXTERNAL                          │
├─────────────────────────────────────────────────────┤
│  YouTube IFrame API  → Audio playback               │
│  Google Fonts        → Typography                   │
│  DTSLIB HQ SDK       → Franchise integration        │
└─────────────────────────────────────────────────────┘
```

---

## 3. Architecture: 5-Layer System

```
                    ┌───────────────────┐
                    │   index.html      │  ← Entrada (Entry Portal)
                    │   Ritual + Nav    │
                    └─────────┬─────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
   ┌────▼────┐          ┌─────▼─────┐         ┌────▼────┐
   │ emisión │          │  cuerpo   │         │ legado  │
   │   L1    │          │    L2     │         │   L5    │
   │Broadcast│          │Body Gram. │         │ Legacy  │
   └────┬────┘          └───────────┘         └─────────┘
        │
   ┌────┴────────────────────────┐
   │  /l1  /l2  /l3  /l4  /club  │
   │  /oneday                    │
   │  (Class/Program Pages)      │
   └─────────────────────────────┘
        │
   ┌────▼────┐          ┌─────────┐
   │laborat. │          │ control │
   │   L3    │          │   L4    │
   │Gestures │          │ Console │
   └─────────┘          └─────────┘
```

### Layer Definitions

| Layer | ID | Purpose | Verb |
|-------|-----|---------|------|
| 1F | `emisión/` | Broadcast — Class programs, schedules | Sintonizá |
| 2F | `cuerpo/` | Body Grammar — Movement tutorials | Sentí |
| 3F | `laboratorio/` | Gesture Lab — Body protocol engine | Experimentá |
| 4F | `control/` | Control Room — System console | Observá |
| 5F | `legado/` | Legacy — Constitution, archives | Recordá |

---

## 4. Directory Structure

```
tango-magenta/
│
├── index.html                  # Entry portal (Ritual + 5-Layer navigation)
│
├── emisión/                    # L1: Broadcast / Classes
│   ├── index.html              # Overview
│   ├── l1/index.html           # Signature Step (L1 program)
│   ├── l2/index.html           # Partner Mastery (L2 program)
│   ├── l3/index.html           # Film (L3 program)
│   ├── l4/index.html           # Buenos Aires (L4 program)
│   ├── club/index.html         # Practice club
│   └── oneday/index.html       # One-day class
│
├── cuerpo/                     # L2: Body Grammar
│   └── index.html
│
├── laboratorio/                # L3: Gesture Lab
│   └── index.html
│
├── control/                    # L4: Control Room
│   ├── index.html
│   └── console/index.html      # System console
│
├── legado/                     # L5: Legacy
│   ├── index.html
│   ├── archivo/index.html      # Archive
│   └── plan/index.html         # Strategic plan
│
├── inner/                      # Hidden Gate (password: 1126)
│   └── index.html
│
├── design/                     # Design System
│   ├── tango.css               # Token-based CSS (1349 lines)
│   ├── body-protocol.js        # Interaction protocol
│   └── entrada.js              # Ritual entrance
│
├── api/                        # Static JSON endpoints
│   ├── content.json            # Content manifest
│   ├── gestures.json           # Gesture database
│   └── legacy.json             # Legacy archive data
│
├── specs/                      # Specifications
│   └── constitution.md         # World constitution
│
├── assets/
│   ├── icons/
│   ├── og/                     # OpenGraph images
│   └── audio/
│
├── devlog/                     # Development logs
│   ├── 2026-01-24.md
│   └── 2026-01-24-review.md
│
├── FACTORY.json                # Core system config v2.0
├── branch.json                 # Franchise OS identity
├── CLAUDE.md                   # Agent protocol guide
├── manifest.webmanifest        # PWA manifest
├── .lighthouserc.json          # Lighthouse CI config
├── sitemap.xml
├── robots.txt
└── .nojekyll
```

---

## 5. Design System (tango.css)

### 5.1 Color Tokens

```css
--void: #0a0008;        /* Background */
--smoke: #110d10;       /* Surface */
--wall: #1a1118;        /* Elevated surface */
--magenta: #E91E63;     /* Primary accent */
--gold: #FFD54F;        /* Secondary accent */
--glow: #f0e8ec;        /* Text primary */
--dim: rgba(240,232,236,0.45);  /* Text secondary */
```

### 5.2 BPM Timing System (70 BPM Tango Lento)

```css
--beat: 857ms;          /* 1 beat */
--half: 428ms;          /* Half beat */
--double: 1714ms;       /* 2 beats */
--breath: 2571ms;       /* 3 beats (breath cycle) */
--phrase: 3428ms;       /* 4 beats (musical phrase) */
```

### 5.3 Motion Curves (Dance-Inspired)

```css
--approach: cubic-bezier(0.16, 1, 0.3, 1);    /* Entrance */
--retreat: cubic-bezier(0.7, 0, 0.84, 0);     /* Exit */
--embrace: cubic-bezier(0.34, 1.56, 0.64, 1); /* Overshoot */
--release: cubic-bezier(0.25, 0, 0.5, 1);     /* Gentle end */
```

### 5.4 Typography

| Class | Font | Use |
|-------|------|-----|
| `.monumento` | Playfair Display | Headlines |
| `.susurro` | JetBrains Mono | Whisper labels |
| `.voz` | DM Sans | Body copy |
| `.ko` | Pretendard/Noto | Korean text |
| `.codigo` | JetBrains Mono | Code blocks |

---

## 6. Body Interaction Protocol

> "El cuerpo es la interfaz. El tango es el protocolo."

### 6.1 Event Mapping

| DOM Event | Protocol Action | Spanish | Implementation |
|-----------|-----------------|---------|----------------|
| scroll | Approach | Acercarse | IntersectionObserver |
| tap/click | Commit | Compromiso | click/touchend |
| long-press | Wait | Esperar | touchstart + 857ms |
| swipe | Turn | Girar | touchstart/end diff |
| idle 3s | Breathe | Respirar | body.respirando class |
| back | Release | Soltar | history.back() |

### 6.2 Implementation (body-protocol.js)

```javascript
// Scroll → Reveal elements on approach
IntersectionObserver('.revelar', { threshold: 0.08 })

// Hold → Reveal secrets after 857ms (1 beat)
[data-secreto] → addClass('secreto-visible')

// Idle → Breathing mode after 3s
setTimeout(() => body.classList.add('respirando'), 3000)

// Swipe → Navigate between layers
diffX > 80 && elapsed < 400 → navigate(direction)
```

---

## 7. Audio Layer

### 7.1 Architecture

```
┌─────────────────────────────────────────────────────┐
│  .reproductor (fixed bottom, 28px height)           │
├─────────────────────────────────────────────────────┤
│  ┌──────┐  ┌────────────────────────────┐  ┌────┐  │
│  │ LIVE │  │  Scrolling ticker text     │  │ ▶ │  │
│  │ (dot)│  │  (CNN-style animation)     │  │   │  │
│  └──────┘  └────────────────────────────┘  └────┘  │
├─────────────────────────────────────────────────────┤
│  Hidden YouTube IFrame Player (audio only)          │
└─────────────────────────────────────────────────────┘
```

### 7.2 Technical Details

- **Source**: YouTube IFrame API (video hidden, audio only)
- **Autoplay**: First user touch triggers playback
- **Default Track**: "Por una Cabeza" - Carlos Gardel
- **Loop**: Enabled
- **Visual**: CNN-style breaking news ticker

---

## 8. Ritual Entrance

### 8.1 Sequence

```
0s    → Black screen
1s    → Skip button appears (건너뛰기)
2.5s  → "Respirá despacio." fades in
5.5s  → Ritual fades out, main content appears
```

### 8.2 Skip Logic

- First visit: Full ritual plays
- Return visit: Skipped via `sessionStorage.getItem('tango_entered')`

---

## 9. SEO & Accessibility

### 9.1 Schema.org

```json
{
  "@type": "DanceSchool",
  "name": "탱고 마젠타",
  "telephone": "+82-507-1402-3774",
  "address": "선릉로 709 B1, 강남구, 서울특별시",
  "priceRange": "₩10,000-₩80,000"
}
```

### 9.2 Bilingual Support

- Base language: `lang="es-AR"`
- Korean overlay: `<span lang="ko" class="ko">한국어</span>`
- Bing Read-Aloud compatible
- Browser translation compatible

### 9.3 Accessibility

- Semantic HTML5 (`<section>`, `<article>`, `<nav>`)
- ARIA labels on interactive elements
- `prefers-reduced-motion` support
- `prefers-contrast: high` support
- Focus-visible outlines

---

## 10. External Integrations

### 10.1 DTSLIB HQ SDK

```html
<script src="https://dtslib1979.github.io/dtslib-branch/hq/sdk/dtslib-bridge.js"></script>
```

- Connects to Franchise OS headquarters
- Syncs notices and SDK updates
- Defined in `branch.json` subscriptions

### 10.2 Dependencies

| Dependency | Source | Purpose |
|------------|--------|---------|
| YouTube IFrame API | youtube.com | Audio playback |
| Google Fonts | fonts.googleapis.com | Typography |
| DTSLIB SDK | github.io | Franchise sync |

---

## 11. Performance

### 11.1 Lighthouse CI

```json
// .lighthouserc.json
{
  "ci": {
    "collect": { "url": ["http://localhost/"] },
    "assert": {
      "assertions": {
        "categories:performance": ["warn", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.9 }]
      }
    }
  }
}
```

### 11.2 Optimizations

- Critical CSS/JS preload
- No build step (pure static)
- SVG inline graphics
- Grain texture via data URI
- YouTube preconnect

---

## 12. Security

- No user data collection
- No cookies (sessionStorage only)
- No external form submissions
- Gate password stored in HTML data attribute
- HTTPS enforced via GitHub Pages

---

## 13. File Statistics

| Category | Files | Lines (approx) |
|----------|-------|----------------|
| HTML | 17 | ~3,500 |
| CSS | 1 | 1,349 |
| JavaScript | 2 | ~250 |
| JSON | 5 | ~200 |
| Markdown | 4 | ~400 |
| **Total** | **29** | **~5,700** |

---

## 14. Key Patterns

### 14.1 Component Classes

| Class | Purpose |
|-------|---------|
| `.espacio` | Full-height section container |
| `.espacio-centro` | Centered content section |
| `.tarjeta` | Card component |
| `.puerta` | Button/link component |
| `.revelar` | Scroll-reveal animation |
| `.susurro` | Whisper label |
| `.monumento` | Hero headline |

### 14.2 State Classes

| Class | Trigger |
|-------|---------|
| `.visible` | IntersectionObserver |
| `.respirando` | 3s idle |
| `.secreto-visible` | 857ms hold |
| `.despierta` | Ritual complete |
| `.alive` | Scroll activity |

---

## 15. Known Constraints

| Constraint | Reason |
|------------|--------|
| Mobile-only (430px) | Design decision |
| No Service Worker | Audio layer compatibility |
| YouTube dependency | Audio playback |
| Static hosting | GitHub Pages limitation |

---

*Document generated: 2026-01-26*
*Repository: github.com/dtslib1979/tango-magenta*
