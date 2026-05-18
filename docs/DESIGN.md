---
name: Portfolio Design
modes:
  light:
    primary: "#1055C9" # Cobalt Blue (Mapped to var(--accent) in components)
    secondary: "#4776C4" # Muted Royal
    success: "#2563EB" # Electric Blue (var(--success))
    warning: "#E67E22" # Energy Alert
    danger: "#C0392B" # High Carbon
    surface: "#F9F9F7" # Warm Stone (var(--bg) / var(--code-bg))
    text: "#050A08" # Obsidian (var(--text-h))
    neutral: "#ECECE8" # Soft Pebble (var(--border))
    text-body: "#4B5563" # Mapped from var(--text)
    text-muted: "#6B7280" # Mapped from var(--text-muted)
    text-dim: "#71717a" # Mapped from var(--text-dim)
  dark:
    primary: "#60A5FA" # Sky Frost (var(--accent))
    secondary: "#93C5FD" # Pale Azure
    success: "#3B82F6" # Vibrant Blue (var(--success))
    warning: "#FDBA74" # Soft Amber
    danger: "#F87171" # Muted Red
    surface: "#0D110F" # Deep Charcoal (var(--bg))
    text: "#F1F5F9" # Off-white (var(--text-h))
    neutral: "#1A1F1D" # Dark Spruce (var(--border))
    text-body: "#8B949E" # Mapped from var(--text)
    text-muted: "#7D8590" # Mapped from var(--text-muted)
    text-dim: "#6E7681" # Mapped from var(--text-dim)
typography:
  fonts:
    sans: "Space Grotesk, Inter, system-ui, sans-serif" # var(--sans)
    heading: "Space Grotesk, Inter, system-ui, sans-serif" # var(--heading)
    mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" # var(--mono)
  scale: "14px / 16px / 18px / 24px / 32px / 48px"
  lineHeight: "1.5"
  baseSize: "16px"
structural:
  borders: "Thick, crisp un-rounded edges for structural layout container elements"
  shadows: "Flat, hard offsets without blur for Neo-brutalism components"
  animations:
    - fade-in (0.5s ease-out)
    - slide-up (0.4s ease-out)
    - slide-in-left (0.4s ease-out)
    - slide-in-right (0.4s ease-out)
    - mesh-blob-1, 2, 3 (Dynamic background environmental elements)
---

## Overview

A serious, high-contrast Neo-brutalism design system built for high-performance architectural solutions. By combining stark structural containers, heavy borders, and un-blurred shadows with cobalt blue primary tones and warm stone surfaces, it achieves an architectural balance of technical precision and structural gravity.

## Style Foundations (Mapped to global.css)

- **Visual Style (Neo-brutalism):** Flat UI cards with thick borders (`var(--border)`), sharp angles, and deliberate hard shadows (`var(--shadow)`). Avoids modern soft gradients, utilizing raw structural boundaries instead.
- **Typography Scale:** Aligned with global document hierarchy:
  - Base document size: `16px` with a `1.5` line height.
  - Headings utilize prominent sizing up to `48px` to anchor user layout sections.
- **Typography Fonts:**
  - `font-sans` & `font-heading`: **Space Grotesk** blended with **Inter** for raw, high-readability industrial typography.
  - `font-mono`: **UI Monospace** suite for displaying technical grid variables and performance terminal outputs.
- **Color Palette:** Grounded technical tones built directly into functional theme slots (`--color-accent`, `--color-bg`, `--color-text`, `--color-border`).

## Color Token Mapping & Interaction

- **Primary / Accent (`--color-accent`)**: Represents the engineering framework of the grid. Cobalt Blue in light mode for structural focus; transitions to high-visibility Sky Frost in dark mode to cut through heavy charcoal interfaces.
- **Success (`--color-success`)**: Electric Blue (Light) and Vibrant Blue (Dark). Used for raw validation states, positive grid ROI indicators, and performance optimizations.
- **Surfaces (`--color-bg`, `--color-code-bg`, `--color-sidebar-bg`)**: Warm Stone components sit starkly against flat backgrounds. Code blocks drop into a solid contrasting gray (`#f6f8fa` / `#161b22`) to highlight raw terminal output.
- **Text Layering**:
  - `var(--text-h)`: Pure Obsidian or Off-white for stark headers and structural data labels.
  - `var(--text)`, `var(--text-muted)`, `var(--text-dim)`: Progressive contrast shifts to control data hierarchy down through technical copy.

## Component & Layout Behaviors

### Structural Containers

All active cards, sidebar wrappers, and interactive panels reject smooth gradients in favor of flat fills, bounded by solid borders (`var(--border)`). Elements use immediate transitions or rigid layout shifts paired with fine-tuned structural movement:

- **Animations:** Content entry is driven by snappy translation sequences (`slide-up`, `slide-in-left`, `slide-in-right`). Environment layers utilize organic background mesh cycles (`mesh-blob`) to bring life behind raw layout lines.
- **Focus Rings:** High-visibility focus indicators mapping an immediate offset outline directly to `var(--accent)`.

### Markdown Typography Composition (`.markdown-content`)

- Headings default to structural bold profiles using `var(--font-heading)`.
- Inline code elements pull raw accent contrast over solid background surfaces (`bg-code-bg text-accent`), ensuring technical strings snap forward immediately in reading flows.
- Unordered and ordered lists use clean, rigid spacing structures to prioritize technical scanning.
