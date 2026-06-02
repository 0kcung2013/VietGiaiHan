# UI Design System — Việt Giai Hân
> Tài liệu này là **nguồn sự thật duy nhất** cho toàn bộ giao diện.  
> Mọi component, page, style đều phải tuân theo spec này.

---

## 1. Tổng quan Aesthetic

| Thuộc tính | Giá trị |
|---|---|
| **Phong cách** | Luxury Craft — thủ công cao cấp, ấm áp, tinh tế |
| **Cảm giác** | Như đang cầm một tờ catalogue của thương hiệu gỗ Nhật/Ý |
| **Màu chủ đạo** | Nâu gỗ ấm (warm wood tones) |
| **Không được** | Gradient tím, bo tròn quá nhiều, trông như SaaS app |

---

## 2. Color Tokens

Định nghĩa toàn bộ trong `src/styles/tokens.css` (CSS Custom Properties):

```css
:root {
  /* === BRAND COLORS === */
  --color-wood-50:  #FAF6F0;   /* background trang chính */
  --color-wood-100: #F2E8D9;   /* surface card, section alt */
  --color-wood-200: #E0CBAE;   /* border, divider */
  --color-wood-300: #C9A97A;   /* accent nhẹ */
  --color-wood-500: #9B6A2F;   /* primary brand */
  --color-wood-700: #6B4520;   /* text heading trên nền sáng */
  --color-wood-900: #3A2010;   /* text đậm nhất */

  --color-cream:    #FDFAF5;   /* page background */
  --color-charcoal: #2C2416;   /* body text */
  --color-gold:     #C8992A;   /* highlight, CTA accent */
  --color-gold-light: #F5E6B8; /* gold tint background */

  /* === SEMANTIC === */
  --color-bg-page:      var(--color-cream);
  --color-bg-surface:   var(--color-wood-50);
  --color-bg-elevated:  #FFFFFF;
  --color-bg-dark:      var(--color-wood-900);

  --color-text-primary:   var(--color-charcoal);
  --color-text-secondary: #6B5C47;
  --color-text-muted:     #A08C73;
  --color-text-inverse:   #FAF6F0;

  --color-border:         var(--color-wood-200);
  --color-border-strong:  var(--color-wood-300);

  --color-accent:         var(--color-gold);
  --color-accent-hover:   #B8851F;

  /* === SHADOW === */
  --shadow-sm:  0 1px 3px rgba(58, 32, 16, 0.08);
  --shadow-md:  0 4px 16px rgba(58, 32, 16, 0.12);
  --shadow-lg:  0 12px 40px rgba(58, 32, 16, 0.16);
  --shadow-card: 0 2px 8px rgba(58, 32, 16, 0.10);
}
```

---

## 3. Typography

### Font Stack
```css
/* Paste vào index.html <head> */
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400&display=swap" rel="stylesheet">
```

```css
:root {
  --font-display: 'Cormorant Garamond', Georgia, serif;  /* Heading lớn, logo */
  --font-body:    'DM Sans', sans-serif;                 /* Body text, UI */
  --font-mono:    'DM Mono', monospace;                  /* Code, số liệu */
}
```

### Scale
```css
:root {
  --text-xs:   0.75rem;    /* 12px — label, caption */
  --text-sm:   0.875rem;   /* 14px — secondary text */
  --text-base: 1rem;       /* 16px — body default */
  --text-lg:   1.125rem;   /* 18px — lead paragraph */
  --text-xl:   1.375rem;   /* 22px — subheading */
  --text-2xl:  1.75rem;    /* 28px — section title */
  --text-3xl:  2.5rem;     /* 40px — page title */
  --text-4xl:  3.5rem;     /* 56px — hero display */
  --text-5xl:  5rem;       /* 80px — super display */
}
```

### Rules
- **Display font** (`--font-display`): dùng cho `h1`, `h2`, hero text, section title lớn. letter-spacing: -0.02em. line-height: 1.1
- **Body font** (`--font-body`): mọi thứ còn lại. line-height: 1.65
- **Không dùng font-weight > 600** cho display font (Cormorant Garamond đẹp nhất ở 400–500)
- Tên công ty "Việt Giai Hân" luôn dùng `--font-display`, weight 500, italic tùy context

---

## 4. Spacing & Layout

```css
:root {
  --space-1:  0.25rem;   /* 4px */
  --space-2:  0.5rem;    /* 8px */
  --space-3:  0.75rem;   /* 12px */
  --space-4:  1rem;      /* 16px */
  --space-6:  1.5rem;    /* 24px */
  --space-8:  2rem;      /* 32px */
  --space-12: 3rem;      /* 48px */
  --space-16: 4rem;      /* 64px */
  --space-24: 6rem;      /* 96px */
  --space-32: 8rem;      /* 128px */

  --container-max: 1200px;
  --container-pad: clamp(1rem, 5vw, 4rem);

  --radius-sm:   4px;
  --radius-md:   8px;
  --radius-lg:   12px;
  --radius-full: 9999px;
}
```

### Grid system
- **Desktop**: 12 columns, gap 24px
- **Tablet**: 8 columns, gap 16px  
- **Mobile**: 4 columns, gap 12px
- Max-width container: `1200px`, centered, padding: `--container-pad`

---

## 5. Component Specs

### 5.1 Navbar
```
- Position: sticky top, backdrop-blur khi scroll
- Height: 72px desktop / 60px mobile
- Background: rgba(253, 250, 245, 0.92) + backdrop-filter: blur(12px)
- Border-bottom: 1px solid var(--color-border) — chỉ hiện khi scroll > 0
- Logo: "Việt Giai Hân" — font-display, size 22px, weight 500
- Logo sub: "Đồ gỗ mỹ nghệ" — font-body, size 11px, muted, letter-spacing 0.15em uppercase
- Nav links: font-body, size 14px, weight 400, color text-secondary
- Nav link active/hover: color wood-700, underline bằng pseudo-element 1px bottom
- CTA button: "Liên hệ" — outlined, border wood-500, text wood-700, hover: bg wood-500 text inverse
- Mobile: hamburger menu, drawer từ phải
```

### 5.2 Hero Section
```
- Height: 100vh (min 600px)
- Layout: 2 cột — text trái 55%, hình phải 45% — KHÔNG dùng full-width image background
- Background: --color-cream với subtle wood grain texture overlay (SVG noise, opacity 0.04)
- Heading: h1, font-display, size clamp(3rem, 6vw, 5rem), weight 400, italic, color wood-900
- Sub-heading: font-body, size lg, color text-secondary, max-width 480px
- CTA primary: bg gold, text white, padding 14px 32px, radius-sm, hover scale 1.02
- CTA secondary: text wood-700, underline, arrow icon →
- Hình bên phải: dạng editorial — không phải hình vuông thông thường, dùng clip-path hoặc
  aspect-ratio 3/4, object-fit cover, có decorative frame nhẹ
- Scroll indicator: dấu xuống nhỏ, animate bounce nhẹ
```

### 5.3 Product Card
```
- Size: 320px wide (fluid trong grid)
- Image: aspect-ratio 4/3, object-fit cover, overflow hidden, hover scale 1.04 (transition 0.4s ease)
- Badge: "Mới" / "Bán chạy" — bg gold-light, text gold, font-body size xs, uppercase, letter-spacing 0.1em
- Title: font-display, size xl, weight 500, color wood-900
- Description: font-body, size sm, color text-secondary, max 2 lines (line-clamp: 2)
- Category tag: color text-muted, size xs, uppercase letter-spacing
- Hover state: card lift — translateY(-4px), shadow-md
- Border: 1px solid color-border
- Radius: radius-md
- No price (B2B — contact để biết giá)
```

### 5.4 Section Title Pattern
```
- Label trên: font-body, size xs, uppercase, letter-spacing 0.2em, color text-muted
  — có decorative line dài 24px màu gold ở trước
- Heading: font-display, size 2xl–3xl, weight 400, color wood-900
- Subtext: font-body, size base, color text-secondary, max-width 560px
- Spacing dưới heading trước content: space-12
```

### 5.5 Button System
```css
/* Primary — dùng cho CTA chính */
.btn-primary {
  background: var(--color-gold);
  color: white;
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  padding: 12px 28px;
  border-radius: var(--radius-sm);
  border: none;
  transition: background 0.2s, transform 0.2s;
}
.btn-primary:hover { background: var(--color-accent-hover); transform: translateY(-1px); }

/* Secondary — outlined */
.btn-secondary {
  background: transparent;
  color: var(--color-wood-700);
  border: 1.5px solid var(--color-wood-500);
  /* ...same padding, radius */
}
.btn-secondary:hover { background: var(--color-wood-500); color: var(--color-text-inverse); }

/* Ghost — link style */
.btn-ghost {
  background: transparent;
  color: var(--color-wood-700);
  border: none;
  text-decoration: underline;
  text-underline-offset: 3px;
}
```

---

## 6. Page Structure — Landing Page

```
/ (Landing Page)
├── <Navbar />                    sticky, transparent → solid on scroll
├── <Hero />                      100vh, 2-col layout
├── <StatsBar />                  số năm KN, số sản phẩm, số tỉnh... — 1 row 4 số
├── <AboutSection />              giới thiệu công ty, hình xưởng
├── <ProductsSection />           grid sản phẩm nổi bật (6–8 sp)
├── <ProcessSection />            quy trình sản xuất (4 bước, timeline horizontal)
├── <MaterialsSection />          nguyên liệu — gỗ tự nhiên, đảm bảo chất lượng
├── <TestimonialsSection />       (optional) đánh giá khách hàng
├── <ContactSection />            form + map + địa chỉ
└── <Footer />                    logo, links, địa chỉ, copyright
```

---

## 7. Animation & Motion

```
Nguyên tắc:
- Subtlety first — không làm người dùng bị phân tâm
- Mọi animation dùng ease-out hoặc cubic-bezier(0.25, 0.1, 0.25, 1)
- Duration: micro 150ms / standard 300ms / elaborate 500ms
- Không dùng animation trên text dài

Scroll reveal (dùng Intersection Observer):
- Element vào viewport: opacity 0→1, translateY 20px→0, duration 500ms
- Stagger giữa các item trong grid: delay 80ms mỗi item
- Threshold: 0.15

Hover effects:
- Card: translateY(-4px) + shadow-md, duration 300ms
- Button: translateY(-1px), duration 200ms
- Image: scale(1.04) bên trong overflow hidden, duration 400ms
- Nav link: underline expand từ trái, duration 200ms

Page load:
- Navbar fade in: opacity 0→1, 300ms, delay 0ms
- Hero text: opacity 0→1, translateY 30px→0, 600ms, delay 200ms
- Hero image: opacity 0→1, scale 1.02→1, 800ms, delay 100ms
```

---

## 8. Icon System

Dùng `@tabler/icons-react` (đã có nếu dùng Mantine):

```tsx
import { IconArrowRight, IconPhone, IconMail, IconMapPin,
         IconTree, IconRuler, IconAward, IconPackage } from '@tabler/icons-react'
```

- Size mặc định: 20px inline, 24px decorative, 40–48px feature icon
- Stroke width: 1.5 (thanh mảnh, phù hợp aesthetic cao cấp)
- Color: inherit từ parent (không hardcode)

---

## 9. Do & Don't

| ✅ DO | ❌ DON'T |
|---|---|
| Dùng Cormorant Garamond cho heading lớn | Dùng Inter/Roboto/Arial |
| Tông màu nâu ấm, kem, vàng gold | Purple gradient, blue đậm |
| Hình editorial (portrait ratio, clip) | Hình banner ngang generic |
| Whitespace rộng rãi | Nhồi nhét content |
| Subtle texture (SVG noise opacity thấp) | Texture ảnh JPEG nặng |
| Transition mượt 300ms | Animation bounce/spin |
| Serif italic cho tên sản phẩm | Tên sản phẩm bold sans-serif |
| Section có label nhỏ phía trên | Jump thẳng vào heading lớn |
| Border radius nhỏ (4–8px) | Bo tròn 20px+ trên card |

---

## 10. Tech Stack

```
Framework:   React 18 + TypeScript + Vite
UI Library:  Mantine UI v7 (createTheme để override token)
Styling:     CSS Modules + file tokens.css global
Icons:       @tabler/icons-react
Animation:   Framer Motion (page transitions + scroll reveal)
Font:        Google Fonts (Cormorant Garamond + DM Sans)
Router:      React Router v6
State:       Zustand (nếu cần global state)
```

### Setup Mantine Theme
```tsx
// src/theme/index.ts
import { createTheme, MantineColorsTuple } from '@mantine/core'

const woodBrown: MantineColorsTuple = [
  '#FAF6F0', '#F2E8D9', '#E0CBAE', '#C9A97A', '#B08040',
  '#9B6A2F', '#7D5220', '#6B4520', '#543515', '#3A2010'
]

export const theme = createTheme({
  fontFamily: 'DM Sans, sans-serif',
  fontFamilyMonospace: 'DM Mono, monospace',
  headings: { fontFamily: 'Cormorant Garamond, Georgia, serif' },
  primaryColor: 'woodBrown',
  colors: { woodBrown },
  defaultRadius: 'sm',
  spacing: { xs: '0.5rem', sm: '0.75rem', md: '1rem', lg: '1.5rem', xl: '2rem' },
})
```

---

*Tài liệu này được cập nhật lần cuối: 2025. Mọi thay đổi design phải cập nhật vào đây trước khi implement.*
