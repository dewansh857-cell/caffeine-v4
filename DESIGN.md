# Caffeine v4 — Design System

## Direction
Calm, focused spec-design platform with two visual themes. New screens: Launcher onboarding (app-store style, step-by-step), Market detail (rich media, pricing), Projects detail (dashboard cards, timelines).

## Tone
Refined minimalism with intentional warmth. Studio = modern Apple-like calm. Classic = terminal precision.

## Differentiation
Per-mode accent colors create distinct emotional zones; clean typography hierarchy with generous whitespace; no full-width bars.

## Color Palette
| Token | Light L C H | Dark L C H | Role |
|:---|:---|:---|:---|
| Background | 0.97 0.01 240 | 0.09 0.004 250 | Main workspace |
| Card | 0.99 0.005 240 | 0.16 0.005 250 | Elevated surfaces |
| Text | 0.18 0.02 250 | 0.94 0.005 250 | Primary content |
| Accent | 0.5 0.25 270 | 0.72 0.18 155 | Interactive highlights |
| Muted | 0.5 0.02 250 | 0.65 0.01 250 | Secondary text |
| Border | 0.89 0.012 240 | 0.28 0.008 250 | Dividers |
| Success | 0.52 0.18 150 | 0.7 0.18 150 | Positive states |
| Warning | 0.6 0.2 70 | 0.75 0.2 70 | Caution states |
| Error | 0.5 0.2 25 | 0.65 0.2 25 | Critical states |
| Onboarding active | 0.5 0.25 270 | 0.72 0.18 155 | Step indicators |
| Onboarding done | 0.52 0.18 150 | 0.7 0.18 150 | Completed steps |
| Pricing badge | 0.55 0.26 300 | 0.72 0.26 300 | Price highlights |
| Metric up | 0.52 0.18 150 | 0.7 0.18 150 | Positive trends |
| Metric down | 0.5 0.2 25 | 0.65 0.2 25 | Negative trends |
| Timeline node | 0.5 0.25 270 | 0.72 0.18 155 | Event markers |

## Typography
- Display: Inter — headings, page titles
- Body: Inter — UI labels, paragraphs
- Mono: GeistMono — code, metrics
- Scale: hero text-5xl, h2 text-3xl, label text-sm, body text-base

## Elevation & Depth
Three shadow levels: card (subtle), elevated (medium), dashboard (dense for metric cards). Surface hierarchy: background < card < elevated < popover.

## Structural Zones
| Zone | Background | Border | Notes |
|:---|:---|:---|:---|
| Header | bg-card | border-b | Top bar, mode-accent colored active item |
| Content | bg-background | — | Main workspace, alternating sections use bg-muted/30 |
| Footer | bg-muted/40 | border-t | Subtle, low-emphasis |
| Sidebar | bg-card | border-r | Build flow right panel, 280px fixed |
| Onboarding | bg-card | border | Large rounded cards, 16px radius |
| Metric cards | bg-card | border | 10px radius, dashboard shadow |

## Spacing & Rhythm
Section gaps: 40px. Content grouping: 24px. Micro-spacing: 8px/12px/16px. Card padding: 24px–32px. Generous whitespace in Build flow.

## Component Patterns
- Buttons: rounded-lg, strong primary bg, subtle lift on hover
- Cards: rounded-lg to rounded-2xl, bg-card, border, shadow-card
- Badges: rounded-full, small padding, semantic color backgrounds
- Option cards: full-width, 32px padding, text-only, hover border-accent
- Metric cards: 10px radius, dashboard shadow, sparkline + big number
- Timeline: vertical line 2px, nodes 12px circles, alternating sides

## Motion
- Entrance: fade-slide 250ms for tabs, stagger 50ms for lists
- Hover: lift 2px + shadow elevate 150ms
- Decorative: none — functional motion only
- All transitions respect prefers-reduced-motion

## Constraints
- Desktop only (min 1024px)
- No full-width bars — all cards have margin and rounded corners
- One heading per page
- No grayed-out buttons — remove instead
- Token-only styling — no raw hex or arbitrary classes
- OKLCH values only — no hsl/rgb wrapping

## Signature Detail
Per-mode accent colors (indigo for Build, amber for Develop, teal for Projects, emerald for Live, coral for Market) make each workspace emotionally distinct while maintaining system coherence.
