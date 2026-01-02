# Style Guide

Design system for the Gift Box app (Коробочка с подарками).

## Design Theme: "Warm & Cozy" (Card Variant 2)

A soft, playful design inspired by lifestyle blogs - approachable yet stylish.

## Color Palette

| Variable | Hex | Usage |
|----------|-----|-------|
| `--primary` | #D4A5A5 | Buttons, accents, borders |
| `--primary-dark` | #C49494 | Button hover, subtitle text |
| `--primary-light` | #F0E0E0 | Card borders, disabled states |
| `--text` | #5C4A4A | Main headings, body text |
| `--text-light` | #8B7575 | Labels, secondary text, descriptions |
| `--bg` | #FDF6E3 | Page background (warm cream) |
| `--card-bg` | #FFFFFF | Card backgrounds |
| `--border` | #EDE4D4 | Subtle borders |
| `--gift-title` | #7A5C5C | Gift name text |

## Typography

**Font Family:** Nunito (Google Fonts)
- Weights: 400, 600, 700, 800

| Element | Size | Weight | Color |
|---------|------|--------|-------|
| Page title (h1) | 1.8rem | 700 | `--text` |
| Subtitle "для Евгении" | 1.35rem | 700 | `--primary-dark` |
| Gift label | 1rem | 600 | `--text-light` |
| Gift name | 1.6rem | 800 | `--gift-title` |
| Description | 0.92rem | 400 | `--text-light` |
| Buttons | 1.02rem | 700 | white |

## Components

### Gift Card
- Background: white (`--card-bg`)
- Border: 2px solid `--primary-light`
- Border-radius: 28px
- Padding: 28px 24px 32px
- Shadow: `0 4px 24px rgba(212, 165, 165, 0.15)`
- Inner glow: `inset 0 0 40px rgba(253, 246, 227, 0.5)`

### Primary Button
- Background: gradient from `--primary` to `--primary-dark`
- Border-radius: 16px
- Shadow: `0 4px 14px rgba(212, 165, 165, 0.35)`
- Hover: lift -2px with stronger shadow

### Disabled Button (Festive)
- Background: gradient from `--primary-light` to #E8D4D4
- Color: `--text-light`
- No shadow, no transform

### Secondary Button (Reject)
- Background: transparent
- Border: 2px solid `--border`
- Border-radius: 12px

### Navigation Link
- Border: 2px solid `--border`
- Border-radius: 20px
- Hover: background `--card-bg`, border `--primary`

## Layout

### Main Page
- Max-width: 550px
- Padding: 40px 20px
- Card max-width: 380px

### Overview Page
- Max-width: 800px
- Grid: 4 columns (3 on tablet, 2 on mobile)
- Gap: 14px

## Month Cards (Overview)

| State | Background | Border |
|-------|------------|--------|
| Opened | gradient #FFF5F5 → white | `--primary` |
| Current | gradient #FFFBEB → #FFF9E0 | 3px #F6D55C |
| Upcoming | white, opacity 0.55 | `--border` |

## Responsive Breakpoints

- **Mobile:** 480px and below
  - Body padding: 30px 16px
  - h1: 1.5rem
  - Gift name: 1.15rem

- **Overview tablet:** 650px
  - 3-column grid

- **Overview mobile:** 450px
  - 2-column grid

## Text Content (Russian)

| Element | Text |
|---------|------|
| Page title | Коробочка с подарками |
| Subtitle | для Евгении |
| Gift label | Подарочек на {Month} |
| Primary button | Получить Подарок |
| Reject button | Не хочу этот подарок |
| Disabled button | Ждём следующего месяца! ✨ |
| Nav link | История подарков → |
| Instruction | Готова открыть коробочку? Жми на кнопку, чтобы получить подарок. |
