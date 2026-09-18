# PXM Studio — Void Design System

Source of truth for every color, type, spacing and radius value used across
the site. No component may introduce a value that isn't listed here.

Adapted from a reference style ("Dala": pure-black void, monolithic
weight-400 display type, ultra-light weight-200 body, single saturated
accent, zero cards/borders/shadows) with the accent swapped from
violet/amber to PXM's real brand blue/cyan, taken from the actual PXM logo.

## Visual thesis

Pure-black void canvas (`#000000`, not a dark navy). Headlines are set at
massive scale (up to 113px) at a single weight (400, never bold) — hierarchy
comes from scale and negative tracking, not font weight. Body copy runs at an
ultra-light weight (200) at 18px, deliberately airy. One saturated accent
(electric blue → cyan) is reserved for the primary action button and
highlight text; nothing else on the page is colored. No card containers, no
borders, no shadows: everything floats on the void, separated by whitespace
alone.

## Color

| Token | Hex | Role | Contrast on `bg` |
|---|---|---|---|
| `--bg` | `#000000` | Page canvas, every section background — pure black, not a panel color | — |
| `--text` | `#ffffff` | Headlines, body text, primary icon fills | 21:1 |
| `--text-dim` | `#9a9a9a` | Secondary nav text, ghost links, muted labels | 5.6:1 |
| `--text-faint` | `#bdbdbd` | Tertiary captions (lighter than dim — used sparingly, larger text only) | 9.8:1 |
| `--accent` | `#2f7bfa` | Primary action fill (buttons only) | 5.1:1 |
| `--accent-bright` | `#6fe3ff` | Highlight/emphasis text, hover state, link accent | 13.5:1 |

Single accent hue (blue → cyan), used **only** on filled buttons and
highlight text. Never as a section or panel background. No gradients on any
UI component — gradients are reserved for the hero's particle/globe artwork
only.

## Typography

Single typeface across all UI contexts: **Inter** (the documented substitute
for the reference's PPNeueMontreal). Display sizes carry headlines at weight
400 with tight negative tracking — the same weight as body text, but massive
scale creates the hierarchy. Weight 200 is reserved for 18px body copy.
Weight 600 uppercase with wide tracking serves nav labels, eyebrows and
buttons.

Google Fonts import:
`https://fonts.googleapis.com/css2?family=Inter:wght@200;400;500;600;700&display=swap`

### Type scale

| Role | Size | Line height | Letter spacing | Weight |
|---|---|---|---|---|
| caption | 12px | 1.5 | — | 400 |
| nav-label / eyebrow | 14px | 1.2 | 0.35px (uppercase) | 600 |
| body | 18px | 1.5 | — | 200 |
| heading-2xs | 24px | 1.25 | -0.48px | 400 |
| heading-xs | 27px | 1 | — | 400 |
| subheading | 36px | 1.2 | — | 400 |
| heading-sm | 42px | 1.2 | -1.68px | 400 |
| heading | 48px | 1.1 | -1.68px | 400 |
| heading-lg | 78px | 1.1 | -3.12px | 400 |
| display | up to 113px | 1.1 | -4.52px | 400 |

Headline sizes use `clamp()` down to mobile; letter-spacing scales
proportionally with size (roughly `-0.04em` at any display size).

## Spacing

Base unit: 6px. Scale: `6, 12, 18, 24, 30, 36, 60, 96, 120`.
Section gaps: 60–120px vertical, generous and airy (density: comfortable,
not dense). Page max-width: 1280px.

## Shape

- **Pill** (`border-radius: 999px`) — reserved for buttons and tag chips.
- **24px rounded-rect** — reserved for image crops only (photos, product
  shots), never for text/content containers.

No other radius exists. No card panels, no bordered containers anywhere.

## Elevation

None. No shadows anywhere in the system — hierarchy comes from scale, color
contrast and whitespace on the flat black canvas, not elevation.

## Base components

- **Button primary**: filled pill, `--accent` background, `#000000` text,
  14px weight 600 uppercase with 0.025em tracking. Hover → `--accent-bright`
  fill. No shadow, no glow.
- **Button ghost**: no fill, no border, `--text` or `--text-dim` colored
  text only. Hover → `--text` / `--accent-bright`.
- **Nav / eyebrow label**: 14px weight 600 uppercase, `--text-dim` default,
  `--accent-bright` for eyebrows specifically.
- Never place two filled buttons next to each other — one primary action
  per view.

## Do's and don'ts

**Do**
- Use the accent exclusively for filled buttons and highlight text.
- Set every headline at weight 400, never bold — hierarchy via scale only.
- Use weight 200 for all 18px body text.
- Keep `#000000` as every section background, no exceptions.
- Let content float on whitespace; no boxes, no borders, no shadows.

**Don't**
- No filled accent backgrounds behind sections or panels.
- No body text at weight 400 or above.
- No card containers with borders/shadows/background fills.
- No gradients on buttons, text or containers.
- No more than one filled button visible at a time.

## Stack

Vanilla HTML + CSS + Vite. GSAP (`gsap`, `ScrollTrigger`) for motion, kept
from the previous system: snap-out easing `cubic-bezier(0.16, 1, 0.3, 1)`,
150–450ms durations, staggered scroll reveals. Three.js renders the ambient
particle/network-globe background, retained from the previous build and
already in the accent blue/cyan.
