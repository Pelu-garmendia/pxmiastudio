# PXM Studio — Velocity Design System

Source of truth for every color, type, spacing, radius, shadow and motion
value used across the site. No component may introduce a value that isn't
listed here.

Derived from the validated visual + interaction theses (see project history).
Approved by the client from the real PXM logo (electric blue wordmark with a
cut-corner X, on a dark navy tech-energy background).

## Visual thesis

Dark tech-energy interface on near-black navy surfaces, driven by an
electric-blue accent that brightens into cyan glow on interactive states, set
against crisp off-white type. Headlines run in bold italic Saira for a
chiseled, high-velocity feel; body copy stays in neutral Inter for
readability. Spacing keeps the airy 140px section rhythm, but components mix
soft pill CTAs with single-corner-clipped cards that echo the logo's cut X.

## Interaction thesis

Fast, propulsive motion in the 150–450ms range on a single snap-out easing,
`cubic-bezier(0.16, 1, 0.3, 1)`. Hovers respond with a quick 220ms lift plus a
blue-to-cyan glow bloom. Scroll reveals slide laterally (24–32px horizontal +
opacity, staggered 80–120ms) instead of simple fade-ups. Forbidden:
bounce/elastic easing, cinematic fades over 600ms, decorative spin unrelated
to content.

---

## Color

| Token | Hex | Role | Contrast on `bg` |
|---|---|---|---|
| `--bg` | `#05070d` | Page ground | — |
| `--surface` | `#0d1420` | Card / elevated fill | text: 17.1:1 |
| `--surface-2` | `#141f33` | Hover / secondary elevation | — |
| `--accent` | `#2f7bfa` | Primary interactive color | 5.1:1 |
| `--accent-bright` | `#6fe3ff` | Hover glow, highlights, data | 13.5:1 |
| `--text` | `#f3f6fc` | Primary text | 18.6:1 |
| `--text-dim` | `#8c97ad` | Secondary text | 6.9:1 |
| `--text-faint` | `#4c5568` | Tertiary / labels | ~3.3:1 (large text / labels only) |
| `--border` | `rgba(255,255,255,.08)` | Hairlines, dividers | — |

Single accent hue (blue → cyan). No purple, no secondary competing accent
anywhere on the page.

## Typography

| Role | Family | Weights | Notes |
|---|---|---|---|
| Display | `Saira` | 700, 800, 900 (+ italic 800/900) | Headlines, hero, section titles. Italic reserved for the hero H1 and standalone display moments — not body headings. |
| Body | `Inter` | 400, 500, 600 | Paragraphs, nav, buttons |
| Data / utility | `JetBrains Mono` | 400, 500 | Index numbers, stats, eyebrows, captions |

Google Fonts import:
`https://fonts.googleapis.com/css2?family=Saira:ital,wght@0,700;0,800;0,900;1,800;1,900&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap`

Scale (desktop → mobile via `clamp()`):
- Hero H1: `clamp(2.1rem, 5.4vw, 4.4rem)`, 800 italic
- Section H2: `clamp(1.8rem, 3.4vw, 2.6rem)`, 700
- H3 (card/row titles): `1.2–1.4rem`, 700
- Body: `1–1.15rem`, 400, `--text-dim`
- Mono / eyebrow: `.72–.85rem`, 500, uppercase, `.08–.12em` tracking

## Spacing

Base scale in px: `4, 8, 12, 16, 24, 32, 48, 64, 96, 140`.
Section vertical rhythm stays at `140px` desktop / `96px` mobile (unchanged
from the existing layout — the identity update doesn't touch macro-layout).

## Shape

Two shapes only, split by role — never mixed:

- **Pill** (`border-radius: 999px`) — reserved for CTAs and tag/badge chips.
- **Single-corner clip** — reserved for cards and content containers:
  `clip-path: polygon(0 0, 100% 0, 100% 100%, 22px 100%, 0 calc(100% - 22px));`
  (bottom-left corner cut, echoing the logo's X). Scale the cut to `18px` on
  small components, `22–28px` on cards.

No other radius or corner treatment exists in the system.

## Elevation (shadows)

Blue-tinted glow, never neutral black:

| Level | Value | Use |
|---|---|---|
| 1 | `0 4px 16px rgba(47,123,250,.14)` | Resting card |
| 2 | `0 10px 32px rgba(47,123,250,.24)` | Hover |
| 3 | `0 18px 56px rgba(111,227,255,.34)` | Active / focus glow |

## Motion tokens

| Token | Value | Use |
|---|---|---|
| `--ease-snap` | `cubic-bezier(0.16, 1, 0.3, 1)` | The only easing curve in the system |
| duration fast | `150ms` | Micro (icon shifts, small state flips) |
| duration normal | `220–280ms` | Default hover / button transitions |
| duration reveal | `450ms` | Scroll-triggered reveals, page-load |
| stagger | `80–120ms` | Between items in a group |
| hover lift | `translateY(-2px) scale(1.02–1.03)` | Buttons, cards |
| reveal motion | `translateX(-24px to -32px)` + opacity | Scroll reveals — lateral, not vertical fade-up |

**Forbidden:** any bounce/elastic easing, fades slower than 600ms, spin/rotate
without content justification, `window.addEventListener('scroll', ...)` for
anything (use GSAP ScrollTrigger, already in the stack).

## Base components

- **Button primary**: pill, `--accent` fill, `#05070d` text, hover →
  `--accent-bright` fill + lift + level-2 glow.
- **Button ghost**: pill, `--border` outline, hover → `--accent-bright`
  border, no fill change.
- **Card**: `--surface` fill, single-corner clip, `--border` outline, hover →
  border brightens to `rgba(111,227,255,.4)`, no fill change (glow is on
  buttons, not passive cards).
- **Nav link**: Inter 500, `--text-dim` default, `--text` on hover, 200ms.

## Stack

Vanilla HTML + CSS + Vite. GSAP (`gsap`, `ScrollTrigger`) for motion. Three.js
for the ambient background. No component framework, no CSS framework — all
tokens ship as CSS custom properties in `src/style.css`.
