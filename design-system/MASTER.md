# Design System: La Guaira Resiliente Digital

**Generado para**: Plataforma de Educación y Impacto Social
**Audiencia**: 100,000+ usuarios con alfabetización digital variable
**Stack**: React + Tailwind CSS + Firebase

---

## 🎨 Design System Overview

### Target: Educación / Impacto Social / Plataforma Comunitaria

**RECOMMENDED PATTERN**: Social Proof + Trust-Centric
- Conversion: Emotion-driven with trust elements
- CTA: Above fold, repeated after testimonials
- Sections:
  1. Hero con mensaje de esperanza
  2. Estadísticas de impacto
  3. Tracks de capacitación
  4. Testimonios de beneficiarios
  5. CTA de registro

**STYLE**: Accessible & Ethical Design
- Keywords: Clean, trustworthy, inclusive, warm, accessible, readable
- Best For: Government, healthcare, education, social services
- Performance: Excellent | Accessibility: WCAG AA
- Rationale: Users have varying digital literacy; clarity is paramount

---

## 🎨 Color Palette

### Primary Colors (Trust & Stability)

```css
--color-primary-50: #eff6ff;    /* Lightest blue - backgrounds */
--color-primary-100: #dbeafe;   /* Light blue - hover states */
--color-primary-200: #bfdbfe;   /* Medium light blue */
--color-primary-300: #93c5fd;   /* Medium blue */
--color-primary-400: #60a5fa;   /* Active blue */
--color-primary-500: #3b82f6;   /* Primary blue - main actions */
--color-primary-600: #2563eb;   /* Darker blue - hover */
--color-primary-700: #1d4ed8;   /* Dark blue - headers */
--color-primary-800: #1e40af;   /* Darkest blue */
--color-primary-900: #1e3a8a;   /* Deep navy */
```

### Secondary Colors (Growth & Hope)

```css
--color-success-50: #f0fdf4;    /* Light green background */
--color-success-100: #dcfce7;   
--color-success-500: #22c55e;   /* Success states */
--color-success-600: #16a34a;   /* Success hover */
--color-success-700: #15803d;   
```

### Accent Colors (Energy & Action)

```css
--color-accent-50: #fff7ed;     /* Warm background */
--color-accent-100: #ffedd5;    
--color-accent-500: #f97316;    /* Accent orange - CTAs */
--color-accent-600: #ea580c;    /* Accent hover */
--color-accent-700: #c2410c;    
```

### Warning Colors (Attention)

```css
--color-warning-50: #fffbeb;    
--color-warning-500: #f59e0b;   /* Warning states */
--color-warning-600: #d97706;   
```

### Danger Colors (Errors)

```css
--color-danger-50: #fef2f2;     
--color-danger-500: #ef4444;    /* Error states */
--color-danger-600: #dc2626;    
```

### Neutral Colors (Text & Borders)

```css
--color-gray-50: #f8fafc;       /* Page background */
--color-gray-100: #f1f5f9;      /* Card backgrounds */
--color-gray-200: #e2e8f0;      /* Borders */
--color-gray-300: #cbd5e1;      
--color-gray-400: #94a3b8;      /* Placeholder text */
--color-gray-500: #64748b;      /* Secondary text */
--color-gray-600: #475569;      
--color-gray-700: #334155;      /* Primary text */
--color-gray-800: #1e293b;      /* Headings */
--color-gray-900: #0f172a;      /* Dark mode text */
```

---

## 🔤 Typography

### Font Family

**Primary**: Inter
- Clean, modern, highly readable
- Excellent for screens and small text
- Google Fonts: https://fonts.google.com/share?selection.family=Inter:wght@400;500;600;700

**Fallback**: system-ui, -apple-system, sans-serif

### Type Scale

| Element | Size | Weight | Line Height | Use Case |
|---------|------|--------|-------------|----------|
| H1 | 2.25rem (36px) | 700 | 1.2 | Page titles |
| H2 | 1.875rem (30px) | 600 | 1.3 | Section headers |
| H3 | 1.5rem (24px) | 600 | 1.4 | Card titles |
| H4 | 1.25rem (20px) | 600 | 1.4 | Subsection headers |
| Body Large | 1.125rem (18px) | 400 | 1.6 | Important body text |
| Body | 1rem (16px) | 400 | 1.6 | Default body text |
| Body Small | 0.875rem (14px) | 400 | 1.5 | Captions, labels |
| Caption | 0.75rem (12px) | 400 | 1.4 | Fine print |

### Line Length
- Optimal: 50-75 characters per line
- Maximum: 80 characters

---

## 📐 Spacing System

Based on 4px grid:

| Token | Value | Use Case |
|-------|-------|----------|
| space-1 | 0.25rem (4px) | Minimal spacing |
| space-2 | 0.5rem (8px) | Tight spacing |
| space-3 | 0.75rem (12px) | Small spacing |
| space-4 | 1rem (16px) | Default spacing |
| space-5 | 1.25rem (20px) | Medium spacing |
| space-6 | 1.5rem (24px) | Section spacing |
| space-8 | 2rem (32px) | Large spacing |
| space-10 | 2.5rem (40px) | XL spacing |
| space-12 | 3rem (48px) | Section gaps |
| space-16 | 4rem (64px) | Page sections |

---

## 🎯 Component Patterns

### Cards

```css
.card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

### Buttons

**Primary Button (CTA)**
```css
.btn-primary {
  background: #3b82f6;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 150ms ease;
}

.btn-primary:hover {
  background: #2563eb;
  transform: translateY(-1px);
}
```

**Secondary Button**
```css
.btn-secondary {
  background: white;
  color: #334155;
  padding: 12px 24px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  font-weight: 500;
  cursor: pointer;
  transition: all 150ms ease;
}
```

### Form Inputs

```css
.input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 150ms ease, box-shadow 150ms ease;
}

.input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
```

---

## 🎨 Key Effects

### Transitions
- Duration: 150-300ms
- Easing: ease-in-out
- Apply to: colors, transforms, shadows

### Shadows

| Level | Usage | CSS |
|-------|-------|-----|
| sm | Cards, buttons | `0 1px 3px rgba(0,0,0,0.1)` |
| md | Dropdowns, modals | `0 4px 6px rgba(0,0,0,0.1)` |
| lg | Popovers | `0 10px 15px rgba(0,0,0,0.1)` |
| xl | Modals | `0 20px 25px rgba(0,0,0,0.1)` |

### Border Radius

| Token | Value | Use Case |
|-------|-------|----------|
| rounded-sm | 4px | Small elements |
| rounded | 8px | Buttons, inputs |
| rounded-lg | 12px | Cards |
| rounded-xl | 16px | Large cards |
| rounded-full | 9999px | Avatars, badges |

---

## ♿ Accessibility Requirements

### WCAG 2.1 AA Compliance

- **Color Contrast**: Minimum 4.5:1 for normal text, 3:1 for large text
- **Focus States**: Visible focus ring on all interactive elements
- **Keyboard Navigation**: All functionality accessible via keyboard
- **Screen Reader**: Proper ARIA labels and semantic HTML
- **Touch Targets**: Minimum 44x44px for mobile

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 📱 Responsive Breakpoints

| Breakpoint | Width | Usage |
|------------|-------|-------|
| sm | 640px | Mobile landscape |
| md | 768px | Tablet |
| lg | 1024px | Desktop |
| xl | 1280px | Large desktop |
| 2xl | 1536px | Extra large |

### Mobile-First Approach
- Default styles for mobile (375px+)
- Enhance for larger screens
- Touch-friendly targets (min 44px)
- Simplified navigation

---

## 🚫 Anti-Patterns to Avoid

1. **Don't use low contrast text** - Users with poor vision need clear text
2. **Don't use complex animations** - Can cause motion sickness
3. **Don't use tiny touch targets** - Frustrating on mobile
4. **Don't use jargon** - Keep language simple and clear
5. **Don't skip form labels** - Essential for accessibility
6. **Don't use color alone to convey meaning** - Add text/icons
7. **Don't auto-play media** - Annoying and data-intensive
8. **Don't hide important actions** - Keep CTAs visible

---

## 📋 Pre-Delivery Checklist

- [ ] All colors meet WCAG AA contrast requirements
- [ ] All interactive elements have visible focus states
- [ ] All buttons have cursor: pointer
- [ ] All hover states use smooth transitions (150-300ms)
- [ ] Responsive at 375px, 768px, 1024px, 1440px
- [ ] prefers-reduced-motion is respected
- [ ] No emojis used as icons (use SVG: Lucide/Heroicons)
- [ ] Form inputs have associated labels
- [ ] Error messages are clear and helpful
- [ ] Loading states are indicated
- [ ] Touch targets are minimum 44x44px

---

## 🎯 Project-Specific Guidelines

### For 100K Users
- Optimize images (WebP format)
- Implement lazy loading for below-fold content
- Use CDN for static assets
- Minimize JavaScript bundle size
- Enable service workers for offline support

### For Low Digital Literacy
- Large, clear buttons with text labels
- Simple navigation (max 3 levels)
- Progress indicators for multi-step flows
- Clear error messages with solutions
- Tooltip help for complex features

### For Offline Support
- Cache critical assets
- Show offline indicator
- Queue actions for sync
- Provide clear feedback on connectivity status
