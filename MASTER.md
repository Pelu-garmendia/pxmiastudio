# PXM Studio — Blueprint Design System

Source of truth for every color, type, spacing and radius value used across
the site (`index.html` + `src/style.css`) and the Diagnóstico Digital page
(`diagnostico/index.html`). No component may introduce a value that isn't
listed here.

Matches the look of PXM's Instagram carousels ("Caso real", "Software por
rubro"): deep navy canvas, heavy rounded display
type with one or two words picked out in blue, glossy blue gradient pills
and soft-bordered navy cards.

## Visual thesis

A plain deep navy canvas (`#070d1f`), no grid or pattern. Headlines are big and heavy (Plus Jakarta Sans 800) with tight
tracking; the key words of each headline — and often the closing period —
are colored `--accent-bright`. Small uppercase "eyebrow" pills in a glossy
blue gradient label each view. Content sits on navy cards with a 1px
`--line` border. Body copy is Inter 400 in `--text-dim`.

## Color

| Token | Hex | Role |
|---|---|---|
| `--bg` | `#070d1f` | Page canvas |
| `--surface` | `#0e1830` | Cards, panels |
| `--surface-2` | `#142243` | Inputs, raised surfaces, panel gradient start |
| `--line` | `#1c2b4f` | Card and input borders, ghost button outline |
| `--text` | `#eef2fb` | Headlines and body text |
| `--text-dim` | `#93a1c3` | Secondary copy, labels, nav |
| `--text-faint` | `#c3cde4` | Values in lists (prices) |
| `--accent` | `#3d7bff` | Glow color, hover borders, selection |
| `--accent-bright` | `#5b9bff` | Highlighted words in headlines, the closing period, icons |
| `--green` | `#3ddc84` | Secondary highlight for "caso real" / success copy, used sparingly |
| `--grad-accent` | `#5a90ff → #2f63e6` (top to bottom) | Primary buttons, eyebrow pills, selected chips, step numbers |

Gradient surfaces always carry `inset 0 1px 0 #ffffff55` (top gloss) and a
soft blue glow (`0 10px 30px -10px var(--accent)`).

## Typography

- **Display:** Plus Jakarta Sans 700/800 — headlines (800), card titles and
  buttons (700). Tracking `-0.035em` on headlines.
- **Body:** Inter 400/500/600 — body copy, labels, nav.

Google Fonts import:
`https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap`

| Role | Font | Size | Weight |
|---|---|---|---|
| eyebrow pill | Inter | 13px (11px on phones), uppercase, 0.14em tracking | 600 |
| nav / field label | Inter | 14px uppercase | 600 |
| body | Inter | 16–19px | 400 |
| card title | Plus Jakarta Sans | 21px | 700 |
| section heading | Plus Jakarta Sans | clamp(2rem, 4.5vw, 3rem) | 800 |
| hero | Plus Jakarta Sans | clamp(2.4rem, 4.6vw, 4.4rem) | 800 |

Highlight with `<em>` inside `h1`/`h2` (rendered upright, blue). Wrap a
colored closing period in `<span class="dot">`.

## Shape

- **Pill** (`999px`) — buttons, eyebrows, chips.
- **18px** — cards (services, process steps).
- **14px** — inputs.
- **24px** — panels (dialogs) and image crops.

## Base components

- **Button primary:** `--grad-accent` pill, white Plus Jakarta Sans 700,
  gloss + glow. Hover: `brightness(1.1)`. One per view.
- **Button ghost:** transparent pill with a 1px `--line` outline; outline
  turns `--accent` on hover.
- **Eyebrow:** gradient pill, uppercase label, sits above the headline.
- **Card:** `--surface` fill, 1px `--line` border, 18px radius; border turns
  `--accent` on hover.
- **Step number:** 40px gradient circle with the number in white.
- **Panel:** dialog with a `--surface-2 → --surface` diagonal gradient, 1px
  `--line` border, 24px radius.

## Do's and don'ts

**Do**
- Highlight one or two key words per headline in `--accent-bright`.
- Keep gradients to the blue accent family, on pills and buttons only.
- Keep the canvas plain navy: no grid lines or patterns behind content.

**Don't**
- No italic headlines.
- No more than one primary (gradient) button per view.
- No colors outside this table.

## Stack

Vanilla HTML + CSS + Vite (multi-page: `index.html`, `diagnostico/index.html`).
GSAP for motion (snap-out easing `cubic-bezier(0.16, 1, 0.3, 1)`, 150–450ms,
staggered reveals). Three.js renders the globe background in the accent blue.
