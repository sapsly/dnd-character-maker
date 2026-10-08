# Skin System — Design Specification

**Scope:** 4 new skins (`playful`, `brutalist`, `cozy`, `parchment`) alongside `classic`, on top of the plumbing that already exists. Design-only: no files were changed.

---

## 0. Grounding — what's actually in the code

| Fact | Where it matters |
|---|---|
| `src/lib/skin.ts` defines `Skin = 'classic' \| 'playful' \| 'brutalist' \| 'cozy' \| 'parchment'`, storage key `dnd-character-manager.skin.v1`, `initSkin()` called in `main.tsx`, pre-paint script in `index.html` writes `data-skin` before first paint | IDs below match these exactly. No flash-on-load work needed. |
| `src/styles/skins.css` exists but is **comment scaffolding only** — no declarations yet | This spec fills it. |
| `skins.css` is imported **before `print.css`** (`main.tsx`) | Import slot fixed: skins beat every on-screen layer, print still wins on paper (both (0,2,0), source order decides). |
| `--bw: 1px / --bw-2: 2px / --bw-thick: 3px` exist in `global.css` | Border ladder fully adopted: 79 replacements across 11 files, 0 literal `Npx solid` left (5 dashed intentional, outlines untouched). Setting `--bw: 3px` now thickens every border. |
| `mode.css` (light) now re-derives `--text-strong`, `--surface-sunken`, `--border-subtle`, `--edge*` | Light-leak fixed. Every skin must still define these in **both** modes; see §7.4. |
| `density.css` sets `:root[data-density]` = (0,2,0); `skins.css` imports later at (0,2,0) | Skins would **win ties against density**. Hard rule: skins never declare `--space-*`, `--text-*`, `--content-max`. See §7.1. |
| `--bg-wash-1/2/3` are `color-mix(… var(--accent) …)` — they resolve `--accent` at use time | Washes can be re-tuned per skin **only** as `color-mix` on `var(--accent)`. This is how every skin flatters all 8 accents. |
| `.sheet-skills`, `.sheet-coins-display` paint separators as `background-color: var(--border)` through a 1px grid gap | `--bw` does **not** affect them — only `--border`'s brightness does. Brutalist risk lives here. |
| Radius is almost entirely `var(--radius-*)`. Hardcoded: `50%` (`.theme-swatch`, `.roster-avatar`), `999px` (`.sheet-hp-bar`), one `0` (compendium) | Radius tokens work globally; those four are scoped-CSS jobs. |
| `.app-header::before` (accent gradient fading right), `.page-head::after` (4.5rem accent segment), `.roster-row` 3px accent rail, `.brand-mark` accent gradient | Four shared signatures every skin must re-treat, not ignore. |
| `SkinPicker` rendered in `App.tsx` between DensityToggle and AccentPicker, labels-only | Thumbnails specified in §8 still to be added. |

**Contrast contract inherited from the codebase (unchanged):** `--text` ≥ 7:1, `--text-muted` ≥ 4.5:1, `--text-faint` ≥ 4.5:1 on `--bg` / `--bg-elevated` / `--surface` (deliberately not on `--surface-hover` — this is `global.css`'s own wording). Borders ≥ 3:1 in light mode (the `mode.css` precedent); dark mode may run softer hairlines because its ladder runs the other way (`--border` ≈ 1.4–1.9:1 vs surface, as classic does today).

---

## 1. Shared foundation

### 1.1 Font picks (2 families, self-hosted, verified on Google Fonts)

| | **Display** | **Body / UI** |
|---|---|---|
| Exact family name | **`Fraunces`** | **Archivo** |
| Foundry / licence | Undercase Type — SIL OFL 1.1 | Omnibus-Type — SIL OFL 1.1 |
| Shape | Variable, 4 axes: `wght` 100–900, `opsz` 9–144, `SOFT` 0–100, `WONK` 0–1 | Variable, 2 axes: `wght` 100–900, `wdth` 62–125 (ships as `font-stretch`) |
| Why it fits all four | It's an old-style *soft* serif (Windsor / Souvenir / Cooper lineage) with a softness axis and a wonky-glyph axis — i.e. one family can be **sharp and heavy**, **round and friendly**, or **quirky and hand-drawn** without swapping fonts. | A sturdy grotesque with a tall x-height, built for print and holding at 11–12px labels in dense tables. The **width** axis gives each skin a different body voice while weight covers the rest. |

**Per-skin use of the pair (via `font-variation-settings`, not new files):**

| Skin | Display (`Fraunces`) | Body (`Archivo`) |
|---|---|---|
| **Playful** | `wght 800, SOFT 60, WONK 1` — ink-trapped, slightly wonky terminals; `--track-display-tight: -0.035em` | `wght 450`, labels `wght 700` uppercase `--track-label: 0.12em` |
| **Brutalist** | `wght 900, SOFT 0, WONK 0` — flat, sharp; `text-transform: uppercase` on `.page-title/.section-title/.card-title`; `--leading-display: 0.95` | `wght 500` body, `wght 800` labels uppercase |
| **Cozy** | `wght 600, SOFT 100, WONK 1` — rounded, Souvenir-warm; **looser** tracking (`-0.015em`), `--leading-display: 1.12` | `wght 450`; **strip all `text-transform: uppercase`** (scoped CSS) — sentence case + a leading candy dot instead |
| **Parchment** | `wght 600, SOFT 35, WONK 1`, `opsz 72` for a higher-contrast display cut; italic for `.page-subtitle` / `.empty-desc` | `wght 400/600`, `wdth 97`, uppercase labels at `--track-label: 0.16em` |

**Mechanism (one line, in `skins.css`):** declare `--display-variation` per skin and apply it once to the heading set (`.page-title, .section-title, .card-title, .modal-title, .empty-title, .roster-name, .stub-lead, h1–h6`). Because `SOFT`/`WONK` are *custom* axes, they must go through `font-variation-settings`; axes not named there still follow `font-weight`/`font-optical-sizing`, so headings keep their weight. Verify in Chrome/Safari/Firefox.

**`--font-mono` is untouched in every skin** — it stays the system stack (`SF Mono / Fira Code / Menlo / Consolas`). It ships no file, so it doesn't count against the 2-family budget, and `.number-input-field`, coin fields and `.create-step-index` keep real tabular alignment. (Optional flourish: parchment re-points `--font-mono` at Fraunces **only** for `.brand-mark` — decorative numerals, never for aligned inputs.)

**Decision B (chosen):** All five skins point at Fraunces + Archivo. Classic re-points `--font-display: 'Fraunces', 'Iowan Old Style', 'Palatino Linotype', Palatino, Georgia, serif` with `SOFT 20, WONK 0, wght 600` and `--font-body: 'Archivo', system-ui, …`. Fraunces at that setting is a close cousin of Palatino's texture, and Classic's real identity — the violet-black ladder, 1px hairlines, soft layered shadows, tight tracking — is untouched.

**Files (shipped):** `public/fonts/fraunces-variable.woff2` (wght 100–900, opsz 9–144, SOFT 0–100, WONK 0–1), `public/fonts/fraunces-variable-italic.woff2` (same axes), `public/fonts/archivo-variable.woff2` (wght 100–900, wdth 62–125). `@font-face` blocks at top of `global.css` (`font-display: swap`).

### 1.2 Selector contract (every skin, both modes, both scopes)

```css
/* dark — matches <html> AND a picker chip carrying data-skin locally */
[data-skin='playful'][data-theme='dark'],
[data-theme='dark'] [data-skin='playful'] { … }

/* light — same pair, mirroring mode.css's accent pairing */
[data-skin='playful'][data-theme='light'],
[data-theme='light'] [data-skin='playful'] { … }
```

Both selectors are required: the first paints `<html>`, the second paints the **preview chip** in the skin picker (exactly why `mode.css` pairs its accent blocks). Both are (0,2,0) — which is why `skins.css` sits before `print.css` (§7.2).

`classic` needs no block: `:root` + `mode.css` *is* the classic skin.

### 1.3 What a skin may and may never touch

| Never touch | Why |
|---|---|
| `--accent`, `--accent-hover`, `--accent-contrast` | User-owned; this is the whole 8-accent contract. |
| `--space-*`, `--text-*`, `--content-max` | `density.css` owns them at (0,2,0); skins import later and would win ties. |
| `--danger`, `--danger-text`, `--warning`, `--success`, `--ability-*`, `--hp/ac/temp-hp-color` | Meaning-carrying; must not follow a cosmetic preference (`theme.css` says so explicitly). |
| `--swatch-ink-dark/light`, `--swatch-ring` | Painted under a *user* colour; must stay mode- and skin-independent. |
| Any skin-private decorative token, for state | See §7.5. |

| May touch | How |
|---|---|
| Grounds, borders, text tiers, `--edge*`, `--scrim`, washes | Token blocks per §1.2; washes only as `color-mix(in srgb, var(--accent) N%, transparent)`. |
| `--radius-*`, `--bw*`, `--shadow-*`, `--font-*`, `--track-*`, `--leading-*` | Token blocks. |
| Casing, weight, `font-variation-settings`, textures, flourishes, motion | The skin's scoped rules in `skins.css`. |
| Skin-private decorative colours | Declared **only** inside `[data-skin='…']` (e.g. `--deco-1..3`), used only for illustration. |

---

## 2. Skin 1 — `playful` · Playful dark fantasy

**Intent:** the night side of a toy shop. Ink-plum grounds, sticker badges, doodled rules, chunky pills, small delightful motions. Dark is the hero; light is *daytime toybox*, not a washed-out copy.

### 2.1 Palette — dark variant (the default face)

```css
[data-skin='playful'][data-theme='dark'],
[data-theme='dark'] [data-skin='playful'] {
  --bg:             #141019;  /* ink plum — warmer & lighter than classic's #0a0a0f */
  --bg-elevated:    #1d1726;
  --surface:        #261e2f;
  --surface-hover:  #312841;
  --surface-sunken: #100c15;
  --border:         #4b3f63;
  --border-strong:  #72629a;
  --border-subtle:  #352c47;
  --text:           #f1ecf7;   /* ≈13.5:1 on --surface */
  --text-strong:    #ffffff;
  --text-muted:     #b0a5c3;   /* ≈7.0:1 */
  --text-faint:     #9c91b5;   /* ≈5.6:1 */
  --edge:           rgba(255,255,255,0.07);
  --edge-strong:    rgba(255,255,255,0.14);
  --bg-wash-1: color-mix(in srgb, var(--accent) 11%, transparent);
  --bg-wash-2: color-mix(in srgb, var(--accent)  5%, transparent);
  --bg-wash-3: color-mix(in srgb, var(--accent)  8%, transparent);
  --scrim: rgba(10,7,14,0.80);

  --shadow-sm: 0 2px 3px rgba(0,0,0,0.42);
  --shadow-md: 0 3px 6px rgba(0,0,0,0.38),
               0 14px 28px -14px color-mix(in srgb, var(--accent) 45%, transparent);
  --shadow-lg: 0 6px 12px rgba(0,0,0,0.40),
               0 30px 60px -24px color-mix(in srgb, var(--accent) 40%, transparent);
}
```
The accent-tinted halo in `--shadow-md/lg` is the skin's quiet flex: whichever of the 8 is active, cards glow faintly in *that* hue. No second hue is ever introduced.

### 2.2 Palette — light variant (daytime toybox)

```css
[data-skin='playful'][data-theme='light'],
[data-theme='light'] [data-skin='playful'] {
  --bg:             #f8f3fc;
  --bg-elevated:    #fffdff;
  --surface:        #ffffff;
  --surface-hover:  #f1eaf9;
  --surface-sunken: #eae1f4;
  --border:         #7a6d92;   /* 4.7:1 on --surface → clears the ≥3:1 light rule */
  --border-strong:  #57496f;
  --border-subtle:  #e2d9ef;
  --text:           #241c30;   /* ≈16:1 */
  --text-strong:    #150f21;
  --text-muted:     #5c5170;   /* ≈7.3:1 */
  --text-faint:     #6f6486;   /* ≈5.5:1 */
  --edge:           rgba(36,28,48,0.08);   /* light grounds: dark top-seam, not white */
  --edge-strong:    rgba(36,28,48,0.14);
  --bg-wash-1: color-mix(in srgb, var(--accent) 9%, transparent);
  --bg-wash-2: color-mix(in srgb, var(--accent) 4%, transparent);
  --bg-wash-3: color-mix(in srgb, var(--accent) 7%, transparent);
  --scrim: rgba(20,14,28,0.66);

  --shadow-sm: 0 1px 2px rgba(50,34,70,0.12);
  --shadow-md: 0 2px 4px rgba(50,34,70,0.10), 0 12px 24px -12px rgba(50,34,70,0.28);
  --shadow-lg: 0 4px 8px rgba(50,34,70,0.12), 0 26px 50px -22px rgba(50,34,70,0.34);
}
```

### 2.3 Shape & weight

```css
--radius-sm: 0.5rem; --radius-md: 0.875rem; --radius-lg: 1.125rem;
--radius-xl: 1.5rem; --radius-pill: 9999px;
--bw: 2px; --bw-2: 3px; --bw-thick: 4px;
```
Shadows: soft-and-far with an accent halo (above) — **not** a hard offset, which is brutalist's territory. Skipped `.brand-mark` gradient stays (it's already accent-driven).

### 2.4 Typography
Fraunces `wght 800 / SOFT 60 / WONK 1` on headings; `--leading-display: 1.02`, `--track-display-tight: -0.035em`. Archivo `wght 450` body. Labels (`.field-label`, `.sheet-stat dt`, `.divider-label`, `.ability-name`) go uppercase, `wght 700`, `letter-spacing: 0.12em` — chunky sticker-label voice.

### 2.5 Signature details
1. **Sticker badges** — `.tag--solid`, `.roster-level`, `.create-step-index` get a 2px ink outline in `--accent-contrast`, a ±3° rotation alternating by `nth-child`, and a small white gloss `::after`. `@media screen` only; rotation never on text blocks.
2. **Peel corner** — `.card::after` clips a 14px triangle of `--surface-hover` at the top-right with a 1px `--border` diagonal: the card looks lifted.
3. **Dot-grid card texture** — `.card-body` / `.panel` get `background-image: radial-gradient(color-mix(in srgb, var(--accent) 14%, transparent) 1px, transparent 1px)` at `10px 10px`. Accent-following, decorative, disabled at `data-density='compact'`.
4. **Hand-ruled divider** — `.divider-line` becomes a double stroke (2px at 45% + 1px at 25% accent) with a centred accent pill dot, replacing the flat hairline.
5. **Header spark** — `.app-header::before` keeps its existing fade but gains a trailing 6px accent diamond at the 16% mark; `.page-head::after` becomes a rounded pill with an offset sticker dot at its end.

### 2.6 Micro-interaction character
Bouncy: `cubic-bezier(.34,1.56,.64,1)`, 160–220ms. Hover lifts 2px and rotates 0.4°; press `scale(0.97)` and drops the halo; check marks pop `0 → 1.15 → 1`; roster rail fades in over 160ms. **`prefers-reduced-motion`:** keep every colour/opacity change, drop all transform and rotation (the global guard already collapses durations — do not re-introduce `!important` transitions).

### 2.7 Risk notes
- **Amethyst clash (the one real one):** `#b98cf0` on a plum surface is the lowest-contrast pairing in the skin. Mitigation: this skin never relies on accent *ground tints* for selection — always pair accent with a 2px `--accent-contrast` outline, and prefer accent **borders/badges** over accent **fills**.
- Washes at 11% amethyst on plum will be near-invisible → the skin compensates with the accent shadow halo and the header spark, both at higher opacity.
- Texture behind 11–12px `--text-faint` labels in compact density → texture off in compact (§7.1).
- Rotated badges overlapping adjacent roster text → cap at 3° and only on `.roster-level` / `.tag--solid`, never on `.roster-name` or `.roster-meta`.

---

## 3. Skin 2 — `brutalist` · Neo-brutalist tavern board

**Intent:** an ale-house noticeboard rebuilt by a print shop. Square, thick, hard-edged, saturated *blocks* — deliberately anti-generic. Zero radius, offset shadows, mechanical motion.

**Where the "saturated colour blocks" come from without fighting the accent:** the existing `--ability-*` hues (already fixed, semantic, six of them) and bone/ink neutrals carry the blocks. The accent remains the one *chosen* hue and always appears inside a `--bw-thick` ink outline — never as a tint, never as a gradient. This is what makes all 8 accents survive the skin.

### 3.1 Palette — dark variant

```css
[data-skin='brutalist'][data-theme='dark'],
[data-theme='dark'] [data-skin='brutalist'] {
  --bg:             #121214;  /* neutral ink — deliberately not violet */
  --bg-elevated:    #1b1b1e;
  --surface:        #2a2a2f;  /* light enough that a #000 offset shadow reads */
  --surface-hover:  #34343a;
  --surface-sunken: #0b0b0c;
  --border:         #9a938a;  /* ≈4.7:1 on --surface: bold but not a vibrating wireframe */
  --border-strong:  #f4efe4;  /* bone — modals, secondary buttons, empty states */
  --border-subtle:  #3a3a41;  /* quiet internal rules */
  --text:           #f5f1e8;
  --text-strong:    #ffffff;
  --text-muted:     #b8b2a6;
  --text-faint:     #9d978b;
  --edge:           rgba(255,255,255,0.06);   /* near-irrelevant: hard shadows do the work */
  --bg-wash-1: color-mix(in srgb, var(--accent) 6%, transparent);
  --bg-wash-2: color-mix(in srgb, var(--accent) 3%, transparent);
  --bg-wash-3: color-mix(in srgb, var(--accent) 5%, transparent);
  --scrim: rgba(0,0,0,0.78);

  --shadow-sm: 3px 3px 0 #000000;
  --shadow-md: 4px 4px 0 #000000;
  --shadow-lg: 8px 8px 0 #000000;
}
```
Washes are held **quiet** (6/3/5%) because a soft radial glow contradicts hard-edged design; the skin gets its accent presence from the header rule and blocks instead.

### 3.2 Palette — light variant

```css
[data-skin='brutalist'][data-theme='light'],
[data-theme='light'] [data-skin='brutalist'] {
  --bg:             #f2efe6;  /* manila board */
  --bg-elevated:    #fbf9f2;
  --surface:        #ffffff;
  --surface-hover:  #e9e4d6;
  --surface-sunken: #ddd7c6;
  --border:         #17150f;  /* near-black → ≈17:1, classic brutalist */
  --border-strong:  #000000;
  --border-subtle:  #c9c2b0;
  --text:           #14120d;
  --text-strong:    #000000;
  --text-muted:     #4a463c;
  --text-faint:     #5f5a4e;  /* ≈6.9:1 on white */
  --edge:           transparent;      /* no soft seam in brutalism */
  --bg-wash-1: color-mix(in srgb, var(--accent) 6%, transparent);
  --bg-wash-2: color-mix(in srgb, var(--accent) 3%, transparent);
  --bg-wash-3: color-mix(in srgb, var(--accent) 5%, transparent);
  --scrim: rgba(20,18,12,0.72);

  --shadow-sm: 3px 3px 0 #17150f;
  --shadow-md: 4px 4px 0 #17150f;
  --shadow-lg: 8px 8px 0 #17150f;
}
```
A bonus: `.sheet-skills` / `.sheet-coins-display` paint `var(--border)` through their 1px gap — on light that becomes **black ruled ledger lines on manila**. Exactly the look.

### 3.3 Shape & weight

```css
--radius-sm: 0; --radius-md: 0; --radius-lg: 0; --radius-xl: 0;
--radius-pill: 0;                    /* nav links, tags, segments, step chips all square */
--bw: 3px; --bw-2: 3px; --bw-thick: 4px;
```
Scoped CSS squares the four hardcoded rounders: `.theme-swatch` (`50%`), `.roster-avatar`, `.sheet-hp-bar` (`999px`), and the compendium's `0` stays. Shadows are **offset-only, zero blur**, in a skin-private `--shadow-ink` (light `#17150f`, dark `#000`).

### 3.4 Typography
Fraunces `wght 900 / SOFT 0 / WONK 0`, uppercase on `.page-title`, `.section-title`, `.card-title`, `.modal-title`; `--leading-display: 0.95`, `--track-display-tight: -0.05em`. Archivo body `wght 500`, labels `wght 800` uppercase at `--track-label: 0.1em`. Numerals stay on the system mono — that's the "form" feel.

### 3.5 Signature details
1. **Hard offset shadow** — `.card`, `.panel`, `.btn`, `.modal`, `.tag` get `box-shadow: var(--bw) var(--bw) 0 var(--shadow-ink)`. Press **collapses it** (`box-shadow: none` + `translate(var(--bw), var(--bw))`), so pressing is physically obvious.
2. **Registration ticks** — `.panel` / `.card` draw 10px crop marks at the corners (`::before`/`::after`, `border-top/left` in `--border-strong`). Print-shop marks, `@media screen` only.
3. **Labels as pasted bars** — `.card-head` becomes a flat `--bg-elevated` block with a `--bw-thick` bottom rule; `.divider-label` sits inside a solid block with `2px 6px` padding. Section headers read as printed labels.
4. **Hard-edged header rule** — replace `.app-header::before`'s gradient with three flat stops: accent 0–16%, `--border-strong` 16–40%, then nothing. No gradient survives.
5. **Inversion hovers** — `.roster-row:hover` and `.btn--secondary:hover` flip ground↔text with **no** colour transition (or `0ms`), plus a `--bw-thick` accent rail. Mechanical, not floaty. `.brand-mark`'s accent gradient flattens to a solid accent block with a `--bw` ink outline.

### 3.6 Micro-interaction character
Instantaneous and mechanical: `transition: background-color 0s, color 0s` on inversions; press = translate into the shadow; focus ring becomes a 3px offset double ring (`outline` + `box-shadow`) so it survives on both bone and ink grounds. **Reduced-motion is essentially native here** — say so, and keep the `0s` transitions (they're not motion, they're state).

### 3.7 Risk notes
- **Dense pages get loud.** `.sheet-skills`, `.sheet-coins-display` and compendium rows paint `--border` directly; at `#9a938a` (dark) or `#17150f` (light) that's a strong ruled grid. Mitigation, scoped: re-point the *internal* list rules (`.sheet-skills`, `.sheet-coins-display`, `.roster-row` bottom border, `.sheet-breakdown-row`) to `--border-subtle`, and keep `--bw`-bold `--border` for containers only.
- **Compact density + 3px borders** eats row height → drop `--bw` to 2px / `--bw-thick` to 3px at `data-density='compact'` (§7.1).
- **Accent legibility is safe** in both modes (dark: all 8 are ≥6:1 on `#121214`, matching classic's copper-worst-case 6.2:1; light: mode.css already re-derives each to a dark sibling on bone). The clash risk is *aesthetic*: crimson `#ef6a7a` on manila is loud — which is on-brand here.
- Uppercase display type on long, unbounded character names → `.roster-name` already has `overflow-wrap: anywhere`; keep uppercase **only** on single-line headings and drop it above `--text-3xl` if a name still breaks badly.

---

## 4. Skin 3 — `cozy` · Cozy indie-game UI

**Intent:** soft candy, big friendly type, pillow shapes, playful empty states. Structurally the quietest skin — which is why it's also the safest (§9).

### 4.1 Palette — light variant (the natural face)

```css
[data-skin='cozy'][data-theme='light'],
[data-theme='light'] [data-skin='cozy'] {
  --bg:             #fdf6ee;  /* warm cream */
  --bg-elevated:    #fffbf5;
  --surface:        #ffffff;
  --surface-hover:  #f7ece0;
  --surface-sunken: #f0e4d5;
  --border:         #8c7f70;   /* 3.9:1 on white */
  --border-strong:  #6b6154;
  --border-subtle:  #e5dacb;
  --text:           #2f2a26;
  --text-strong:    #191512;
  --text-muted:     #625a51;
  --text-faint:     #736a60;   /* ≈4.9:1 on --bg, ≈4.8:1 on --surface */
  --edge:           rgba(255,255,255,0.85);   /* visible: cream is not pure white */
  --bg-wash-1: color-mix(in srgb, var(--accent) 8%, transparent);
  --bg-wash-2: color-mix(in srgb, var(--accent) 4%, transparent);
  --bg-wash-3: color-mix(in srgb, var(--accent) 6%, transparent);
  --scrim: rgba(48,34,22,0.55);              /* softer, warmer veil */

  --shadow-sm: 0 1px 2px rgba(84,58,32,0.10);
  --shadow-md: 0 2px 4px rgba(84,58,32,0.08), 0 10px 22px -10px rgba(84,58,32,0.22);
  --shadow-lg: 0 4px 8px rgba(84,58,32,0.10), 0 26px 48px -20px rgba(84,58,32,0.28);
}
```

### 4.2 Palette — dark variant (hearthlight)

```css
[data-skin='cozy'][data-theme='dark'],
[data-theme='dark'] [data-skin='cozy'] {
  --bg:             #1d1712;  /* warm cocoa-black — cozy's dark is warm, not violet */
  --bg-elevated:    #272019;
  --surface:        #2f261d;
  --surface-hover:  #3a2f24;
  --surface-sunken: #171209;
  --border:         #5c4e3f;
  --border-strong:  #8a7660;
  --border-subtle:  #413629;
  --text:           #f6ece0;
  --text-strong:    #fffaf2;
  --text-muted:     #cdbcaa;
  --text-faint:     #b0a08c;   /* ≈5.8:1 on --surface */
  --edge:           rgba(255,255,255,0.08);
  --bg-wash-1: color-mix(in srgb, var(--accent) 10%, transparent);
  --bg-wash-2: color-mix(in srgb, var(--accent)  5%, transparent);
  --bg-wash-3: color-mix(in srgb, var(--accent)  8%, transparent);
  --scrim: rgba(10,7,4,0.75);

  --shadow-sm: 0 1px 2px rgba(0,0,0,0.45);
  --shadow-md: 0 2px 4px rgba(0,0,0,0.40), 0 12px 26px -12px rgba(0,0,0,0.60);
  --shadow-lg: 0 4px 8px rgba(0,0,0,0.42), 0 28px 54px -22px rgba(0,0,0,0.68);
}
```

### 4.3 Shape & weight

```css
--radius-sm: 0.625rem; --radius-md: 1rem; --radius-lg: 1.375rem;
--radius-xl: 1.75rem;  --radius-pill: 9999px;
--bw: 1px; --bw-2: 2px; --bw-thick: 3px;   /* unchanged: softness comes from radius+shadow */
```
**Do not** increase control heights or padding — that would fight the density contract (§7.1).

### 4.4 Typography
Fraunces `wght 600 / SOFT 100 / WONK 1`, `--leading-display: 1.12`, `--track-display-tight: -0.015em` (rounded faces need air). Archivo `wght 450`, `--leading-body: 1.7`. **Strip every `text-transform: uppercase`** in the skin (`.field-label`, `.sheet-stat dt`, `.ability-name`, `.divider-label`, `.create-list-title`) and replace with sentence case preceded by a 6px candy dot. Casing is the enemy of cozy.

### 4.5 Signature details
1. **Pillow cards** — big radii + a white `--edge` inner top highlight + warm shadow; `.card-head`'s bottom rule becomes a **dashed** `--border-subtle` seam — a sewn stitch, not a cut.
2. **Candy dots** — skin-private `--deco-1: #bfe6d4` (mint), `--deco-2: #ffd9c2` (peach), `--deco-3: #ffe9ad` (butter), `--deco-4: #cfe6fb` (sky), applied by `nth-child` to `.create-step-index`, `.sheet-ability` and `.sheet-stat`, always with `--text` ink glyphs. **Illustration only — never state.**
3. **Playful empty states** — `.empty-state` grows to `--radius-xl` with a 2px dashed `--border` ring; `.empty-icon` goes to 4rem and takes a candy fill; `.empty-title` at Fraunces `SOFT 100`, 1.15× size.
4. **Raised selection chips** — `.nav-link.is-active` and `.create-step.is-current` keep the accent tint but gain `--shadow-sm` + `--border-strong`, so "selected" reads as a chip lifted off the fabric.
5. **Sliding rail** — `.roster-row` hover/focus draws a 4px accent rail as `box-shadow: inset 4px 0 0 var(--accent)` (transition on the shadow) — no layout shift, no border-width animation.

### 4.6 Micro-interaction character
Soft overshoot: `cubic-bezier(.34,1.56,.64,1)`, 180–260ms. Hover lifts 2px and deepens the shadow; press `scale(0.985)`; stepper buttons squish; row backgrounds warm while the rail slides. **Reduced-motion:** swap the overshoot for a 120ms colour/opacity change, drop all `scale()`.

### 4.7 Risk notes
- **Candy vs semantics:** mint `#bfe6d4` sits dangerously close to `--success` green and butter `#ffe9ad` to `--warning` amber. Mitigation: candy tokens appear **only** on decorative fills (step dots, ability tile grounds, empty-state art) and never adjacent to a success/warning tag; the ability tiles already carry their own `--ability-*` top rules, which must win.
- Light-mode accent legibility relies on `mode.css`'s dark re-derivation (rose `#ad2668`, copper `#8a4312`) — verify rose at 12px `.link` on cream.
- Large radii shrink inner area → re-check long spell names in `.sheet-spell-pick` and multiclass meta still wrap inside `.roster-name-line`.
- Cozy is so close to Classic structurally that **a bug is easy to miss** — that's an argument for building it *second*, not first (§9).

---

## 5. Skin 4 — `parchment` · Parchment / tavern noticeboard

**Intent:** light-first paper with ink accents, ticket perforations and wax seals. Its dark variant is not "dark paper" — it's the **tavern interior at night**: soot timber, candle-warm cream, brown board.

### 5.1 Palette — light variant (the hero)

```css
[data-skin='parchment'][data-theme='light'],
[data-theme='light'] [data-skin='parchment'] {
  --bg:             #efe5d0;  /* aged page */
  --bg-elevated:    #f7efe0;
  --surface:        #fbf5e8;  /* the notice / sheet */
  --surface-hover:  #f2e9d6;
  --surface-sunken: #e6dac2;
  --border:         #6f6350;   /* 5.4:1 on --surface */
  --border-strong:  #4c4335;
  --border-subtle:  #cdbfa4;
  --text:           #241c12;   /* ink */
  --text-strong:    #120d07;
  --text-muted:     #574a39;   /* ≈7.9:1 */
  --text-faint:     #6b5d4a;   /* ≈5.1:1 on --bg */
  --edge:           rgba(255,255,255,0.65);   /* the sheet's lit top edge — surfaces aren't white, so it shows */
  --bg-wash-1: color-mix(in srgb, var(--accent) 9%, transparent);
  --bg-wash-2: color-mix(in srgb, var(--accent) 4.5%, transparent);
  --bg-wash-3: color-mix(in srgb, var(--accent) 7%, transparent);
  --scrim: rgba(38,28,16,0.60);

  --shadow-sm: 0 1px 1px rgba(90,70,40,0.14);
  --shadow-md: 0 2px 3px rgba(90,70,40,0.12), 0 8px 18px -10px rgba(90,70,40,0.24);
  --shadow-lg: 0 3px 6px rgba(90,70,40,0.14), 0 22px 44px -18px rgba(90,70,40,0.30);
}
```

### 5.2 Palette — dark variant (tavern interior at night)

```css
[data-skin='parchment'][data-theme='dark'],
[data-theme='dark'] [data-skin='parchment'] {
  --bg:             #171310;  /* soot-dark timber */
  --bg-elevated:    #201a15;
  --surface:        #272019;  /* brown board */
  --surface-hover:  #322a21;
  --surface-sunken: #120f0c;
  --border:         #58493a;   /* ≈1.9:1 — classic's dark hairline range */
  --border-strong:  #8a7458;
  --border-subtle:  #3a3128;
  --text:           #f0e4d2;   /* candlelight cream */
  --text-strong:    #fff6e8;
  --text-muted:     #bdac94;
  --text-faint:     #a3907a;   /* ≈5.2:1 */
  --edge:           rgba(255,229,190,0.07);   /* candle-warm seam */
  --bg-wash-1: color-mix(in srgb, var(--accent) 9%, transparent);
  --bg-wash-2: color-mix(in srgb, var(--accent) 4%, transparent);
  --bg-wash-3: color-mix(in srgb, var(--accent) 6.5%, transparent);
  --scrim: rgba(8,6,4,0.78);

  --shadow-sm: 0 1px 1px rgba(0,0,0,0.50);
  --shadow-md: 0 2px 3px rgba(0,0,0,0.45), 0 10px 22px -10px rgba(0,0,0,0.60);
  --shadow-lg: 0 3px 6px rgba(0,0,0,0.45), 0 24px 46px -20px rgba(0,0,0,0.70);
}
```
Paper doesn't change shape at night: **radii and border widths are identical in both modes** — only ground, ink and shadow temperature move. That's what keeps it credible rather than a generic dark theme.

### 5.3 Shape & weight

```css
--radius-sm: 2px; --radius-md: 3px; --radius-lg: 4px; --radius-xl: 6px;
--radius-pill: 9999px;               /* pills survive: they read as punched stamps */
--bw: 1px; --bw-2: 2px; --bw-thick: 4px;   /* thick = the posted-notice rule */
```

### 5.4 Typography
Fraunces `wght 600 / SOFT 35 / WONK 1`, `opsz 72` on `.page-title` for a higher-contrast display cut; **italic** on `.page-subtitle` and `.empty-desc` as a written voice. Archivo `wght 400/600`, `wdth 97`. Labels uppercase at `--track-label: 0.16em` (engraved noticeboard), `--leading-body: 1.7` for a comfortable read on paper.

### 5.5 Signature details
1. **Wax seal** — `.tag--solid` and `.page-head::after` become a ~22px disc in `--accent` with `border-radius: 47% 53% 50% 50%`, an inset shadow and a fine inner ring; the level number / ornament sits inside. Because it's `--accent`, **any of the 8 becomes "a wax of that colour"** — blue wax reads intentional, not clashed.
2. **Perforated card head** — `.card-head::after` draws a ticket perforation with `mask-image: radial-gradient(circle 3px at 8px 100%, transparent 96%, #000 100%)` repeated. Applied to the **decoration only**, never the card box, so focus rings can't be clipped.
3. **Ink rules** — `.page-head` becomes a double rule (2px `--border-strong` + 1px `--border` beneath) and `.page-head::after` becomes a centred 12px fleuron (inline SVG, `--accent`) instead of the 4.5rem accent segment. `.divider--labelled` labels sit in a ruled box.
4. **Paper grain** — `body::before` fixed overlay, SVG `feTurbulence` data-URI at 4% (`multiply` in light) / 3% (`overlay` in dark), `pointer-events: none`, `@media screen` only, **`display: none` at `data-density='compact'`** and **off under `@media print`**.
5. **Stamped labels + notice rail** — `.field-label`, `.sheet-stat dt`, `.divider-label` get uppercase Fraunces at `opsz 72` with a 10px hairline `::before`. The roster's favourite rail becomes a small accent **pin/tack** (`::before` circle) at the row's left instead of a plain 3px bar.

### 5.6 Micro-interaction character
Weighty and damped: 120–180ms `ease-out`. Hover lifts 1px and spreads the shadow (paper coming off the board); press settles 1px; the wax seal scales `1.04` on hover; links draw their underline in via a `background-size` transition. **Reduced-motion:** colour-only transitions; the underline draw becomes instant; no lift.

### 5.7 Risk notes
- **Grain kills faint text.** A 4% noise overlay behind 11–12px `--text-faint` labels is a legibility regression. Mitigation: grain sits behind everything but is capped at 4%, disabled in compact density, and `--text-faint` stays ≥4.6:1 **with grain applied** (re-measure with the overlay on).
- **Temperature clash — azure `#5fb3f0` and verdigris `#46c9b8` read cold on warm paper** and especially against the brown dark variant. Mitigation is *usage, not value* (we may not touch `--accent`): in this skin, accent appears as **seals, rules, underlines and small fills**, never as a large field; washes stay ≤9%. Gold/copper/crimson are the natural pairings; cool accents still read as "a different wax".
- `mask-image` perforations + focus rings → mask the decorative `::after` only; keep the card `overflow: visible` for the ring.
- Print: grain and perforations must be `@media screen`; `print.css` already collapses accent→ink and nulls shadows ✓ (skins import before print).

---

## 6. Per-skin shared-signature matrix

One system, four readings — this is what stops them looking like four unrelated themes:

| Element | playful | brutalist | cozy | parchment |
|---|---|---|---|---|
| `.app-header::before` | existing fade + accent spark diamond | three hard flat stops, no gradient | existing fade, shortened, rounded cap | replaced by the double ink rule |
| `.page-head::after` (4.5rem accent) | pill + offset sticker dot | full-width `--bw-thick` bar, square | thicker rounded pill w/ soft shadow | centred fleuron ornament |
| `.roster-row` rail | 4px accent, rounded end | `--bw-thick` ink, full block fill on hover | `inset 4px 0 0` shadow, slides in | accent pin/tack `::before` |
| `.brand-mark` | keep gradient, add gloss | flat accent block + ink outline | keep gradient, `--radius-md` | keep gradient, seal-shaped radius |
| `.divider-line` | double accent stroke + dot | solid `--bw` bar | dashed `--border-subtle` stitch | ruled box with fleuron |
| `.card` | peel corner + dot texture | hard shadow + crop ticks | pillow + stitch head | perforated head + grain |

---

## 7. Cross-skin rules

### 7.1 Density toggle
- **Skins must never declare `--space-*`, `--text-*` or `--content-max`.** `density.css` is (0,2,0) and `skins.css` imports later — a skin that touched spacing would silently defeat all three density levels.
- Density × skin matrix (scoped rules, all via tokens the skins *may* own):

| | compact | comfortable | spacious |
|---|---|---|---|
| **brutalist** | `--bw: 2px; --bw-thick: 3px` (3px borders eat row height) | full | full |
| **playful** | dot texture **off**, sticker rotation **off**, radii kept | full | full |
| **cozy** | no decorative padding added, `--bw` stays 1px | full | full |
| **parchment** | grain **off**, perforations kept (zero layout cost) | full | full |

- Control heights, focus-ring geometry and breakpoints are identical across all skins × all densities.

### 7.2 Print styles
- `skins.css` imports immediately before `print.css` in `main.tsx` ✓ (source order lets print's paper palette win at equal specificity).
- Every decorative `::before/::after`, texture, grain, perforation and `transform` lives under `@media screen`.
- Skin-specific print adjustments go in `skins.css` inside `@media print` (e.g. `[data-skin='brutalist'] { --bw: 1px; --bw-thick: 2px; }` so 3px borders don't eat the page or toner). `print.css` doesn't declare `--bw`, so nothing conflicts.
- `print.css` already collapses accent→ink, nulls `--shadow-*` and forces `color-scheme: light` ✓ — unchanged by all four skins.

### 7.3 Accent contract (all 4 skins × both modes × 8 accents = 64 states)
- Never declare the accent trio; washes only as `color-mix(… var(--accent) …)`.
- Re-verify per state: **`--accent` vs `--bg` and vs `--surface`** (links, focus rings, active nav) — theme.css's 6.2:1 floor was measured against classic's `#0a0a0f`, not against these grounds. Also verify **wash visibility** (an 11% amethyst wash on playful plum is nearly invisible — that skin compensates with the accent shadow halo, §2.7).
- `::selection`, `--accent-contrast` and all focus rings are unaffected (they resolve against the accent itself).

### 7.4 Two tokens every skin must define in both modes
`mode.css` never re-derives **`--text-strong`** or **`--surface-sunken` / `--border-subtle` / `--edge*`** — they leaked dark values into light mode (`.sheet-hp-current` was the visible symptom). mode.css itself now defines them ✓; every skin block above still defines them explicitly for its own palette.

### 7.5 State must never rest on a skin's private token
`--deco-*` / `--shadow-ink` are illustration. Success / warning / danger / ability hues and the accent remain the only state carriers, in every skin.

---

## 8. Picker UX — the "Visual style" control

**Current state:** `App.tsx` renders Density · **Skin** · Accent · Colour mode (Skin between Density and Accent: skin sets the *world*, accent picks the *hue* within it, mode sets the *light* — Accent/Mode keep their existing adjacency). `.theme-segment` styles exist and `ThemeModePicker` is the pattern cloned by `SkinPicker`.

**Shell:** same `.theme-picker` / `.theme-swatches` pill shell, `showLabel={false}` (label `Visual style`, `visually-hidden`), `.theme-segment` buttons, `aria-pressed`, roving `tabIndex`, arrow/Home/End keys — byte-for-byte the `ThemeModePicker` interaction. Order matches `SKINS` in `skin.ts`: Classic · Playful · Brutalist · Cozy · Parchment.

**Preview — labels-only is *not* right.** "Cozy" vs "Brutalist" is unjudgeable from a word. Recommend **label + micro-thumbnail**:

```tsx
<button className="theme-segment" data-skin={option.value} …>
  <span className="skin-thumb" aria-hidden="true" />  {/* decorative */}
  {option.label}
</button>
```

Each chip carries `data-skin` **locally**. Because the selector contract (§1.2) includes the descendant form (`[data-theme='dark'] [data-skin='x']`), the chip is painted by the *real* skin tokens — **accurate preview, zero duplicated hex**. The thumbnail is a 20×14px card: the skin's `--bg` as the plate, a small inner block in the skin's `--surface`, `border-radius: var(--radius-md)` and `border: var(--bw) solid var(--border)` of that skin. So Brutalist shows square 3px black edges, Cozy shows a fat-radius 1px warm edge, Parchment shows a 4px-radius 1px ink edge — instantly legible.

**Selected state (never colour alone, per `theme.css`):** accent-filled label plate **plus** a 2px `--text` outline around the whole segment; the thumbnail stays in skin colours so the active fill doesn't obscure it. Keyboard focus keeps the neutral `--text` ring the other pickers use.

**No live app-wide preview on hover** — it would fight `initSkin`, produce a flash for keyboard users, and add no information the thumbnail doesn't already give. Each segment gets a `title` with a one-line description instead ("Chunky borders and hard shadows").

**Self-demonstration:** the skin's own scoped rules re-style `.theme-swatches` (radius, border weight, shadow) — so the picker visibly changes with the skin it's picking, which is the best possible affordance.

**Also:** `.app-header-settings` is `position: relative` and clips its children (documented in `app.css` for the `visually-hidden` labels) — the new group inherits that correctly with no change.

---

## 9. Ranked recommendation — what to build first

| # | Skin | Why |
|---|---|---|
| **1** | **Brutalist** | Fastest path to a *complete, convincing* result: it's almost entirely tokens (`--radius-* → 0`, `--bw* → 3px`, hard `--shadow-*`, flat palettes) plus one shared structural treatment. Accent behaviour is the most forgiving (blocks + ink outlines work with all 8 hues in both modes), so it validates the accent contract early. Highest distinctiveness per unit of risk. |
| **2** | **Cozy** | Nearly pure tokens (radii, palette, shadows) — minimal scoped CSS, both modes, low clash risk. Proves the pipeline works for a *soft* skin right after a *hard* one. Build after brutalist because cozy is close enough to Classic that a silent failure would be hard to notice. |
| **3** | **Playful** | Highest new-surface-area cost: textures, peel corners, sticker rotation, doodled dividers — all `@media screen` decorative rules that need per-density gating. Contained accent risk (amethyst). |
| **4** | **Parchment** | Most cross-cutting: paper grain, print interaction, ticket/wax motifs, a dark variant that must be a *different place* (tavern at night), and the largest light/dark divergence. Do it last, once the import-order fix, density matrix and 64-state accent audit are in place. |

**Shared prerequisites (status):**
1. Fix the `skins.css` import slot (before `print.css`) — ✅ done.
2. Finish the `--bw` ladder conversion — ✅ done (79 replacements).
3. Add the `SkinPicker` + "Visual style" row — ✅ done (thumbnails §8 still pending).
4. Build the 64-state contrast audit (4 skins × 2 modes × 8 accents) as a repeatable check — TODO (final QA).
