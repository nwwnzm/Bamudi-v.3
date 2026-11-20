# BaMuDi – Design System & UI/UX Constitution

> **Platform**: BaMuDi (Bantu Mula Digital)
> **Tagline**: Learn. Create. Teach. (Belajar. Cipta. Ajar.)
> **Theme Aesthetic**: BrightPath Modern E-Learning with Warm Approachable Rounded Geometry and Natural Emerald/Teal Dominance.

---

## 1. Product & Audience Identity
- **Primary Audience**: School teachers of all ages, pedagogical backgrounds, and digital literacy comfort levels (Beginner to Advanced).
- **Core Value**: Digital learning that is non-judgmental, reassuring, clear, and focused on empowering teachers to do tasks independently rather than just generating answers for them.
- **Tone**: Professional, welcoming, compassionate, encouraging, and free from intimidating technical jargon.

---

## 2. Color Palette & 60-30-10 System
- **60% Dominant Canvas (Neutral)**:
  - Clean background: `#FDFDFE` (`cloudy-white` / `slate-50`)
  - Crisp cards: `#FFFFFF` (`white`)
  - Hairline borders: `#E2E8F0` (`slate-200`) or subtle `#BAE6FD` (`sky-200`)
- **30% Structural Surfaces**:
  - Soft sky tints: `#E6F5FF` (`sky-50`), `#F0F9FF` (`sky-50/50`)
  - Subdued slate text: `#334155` (`slate-700`), `#64748B` (`slate-500`)
  - Deep dark contrast header/footer: `#0F172A` (`slate-900`) and `#062447` (`sky-950`)
- **10% Accent Focal Points**:
  - Primary Brand Sky Blue: `#0099FF` (action buttons, brand wordmark, active highlights)
  - Accent Amber Red: `#CC310E` (warm accent, mascot sprout & stars, key highlights, badges)
  - Soft Amber Red Tint: `#FDF2F0` / `#FDE8E4` (pill/badge backgrounds paired with `#99240B` or `#1E293B` text for WCAG AA)

---

## 3. Typography & Curvy Approachable Type Scale
- **Display Headings (`h1`, `h2`, `h3`, `.font-display`)**:
  - `font-family: 'Outfit', 'Nunito', 'Plus Jakarta Sans', system-ui, sans-serif;`
  - Letter-spacing: `-0.015em`
  - Friendly rounded geometric letterforms that feel encouraging rather than corporate.
- **Body & Controls**:
  - `font-family: 'Nunito', 'Plus Jakarta Sans', system-ui, sans-serif;`
  - High legibility, warm open counters, comfortable for reading across longer instructions.
- **Data & Numbers**:
  - `font-family: 'JetBrains Mono', monospace;` with `tabular-nums` for timers, step counts, and scores.

---

## 4. Component Patterns & Geometry
- **Outer Container Radius**: `rounded-3xl` (24px) for featured panels and hero cards; `rounded-2xl` (16px) for standard cards.
- **Interactive Pill Controls**: `rounded-full` for search bar, category tabs, language switchers, and primary buttons.
- **Zero-Pill Static Metadata Rule**: Static informational metadata (timestamps, read time, category indicators) is unboxed text separated with `·`.
- **Card Depth**: Single-elevation soft drop shadow (`shadow-xs` to `shadow-md` on hover). No thick left border stripes or gaudy outer neon glow.
- **Touch Targets**: Minimum 44px on mobile and tablet for effortless tapping.

---

## 5. Micro-Interactions & Feedback
- **Smooth transitions**: `duration-200` to `duration-300` with ease-out curves.
- **Interactive Feedback**: Immediate confirmation when copying prompts, moving sandbox folders, or answering quiz questions.
