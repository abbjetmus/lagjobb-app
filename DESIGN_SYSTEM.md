# Design System - LagJobb

## Color Palette

### Gradients

- **Primary**: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)` - Purple gradient for main CTAs
- **Secondary**: `linear-gradient(135deg, #f093fb 0%, #f5576c 100%)` - Pink gradient for accents
- **Success**: `linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)` - Blue gradient for success states

### Shadows

- **Small**: `0 2px 8px rgba(0, 0, 0, 0.04)` - Subtle elevation
- **Medium**: `0 4px 16px rgba(0, 0, 0, 0.08)` - Cards and buttons
- **Large**: `0 8px 32px rgba(0, 0, 0, 0.12)` - Modals and floating elements
- **Extra Large**: `0 16px 48px rgba(0, 0, 0, 0.16)` - Hero sections

## Typography

- **Font Family**: Roboto
- **Headings**: Bold weight (700)
- **Body**: Regular weight (400)
- **Buttons**: Medium weight (500)

## Border Radius

- **Large**: 16px - Cards and major containers
- **Small**: 8px - Inputs and buttons
- **Round**: 20px+ - Pills and badges

## Animations

### Transitions

- **Standard**: `all 0.3s cubic-bezier(0.4, 0, 0.2, 1)`
- **Fast**: `0.15s ease-out`
- **Slow**: `0.6s ease-in-out`

### Effects

1. **Hover Lift**: translateY(-4px) with shadow increase
2. **Float**: Subtle up-down animation (3s infinite)
3. **Fade In**: Opacity 0→1 with translateY(20px→0)
4. **Pulse Glow**: Box-shadow pulse effect (2s infinite)

## Component Patterns

### Cards

- Glass morphism effect with backdrop blur
- Rounded corners (16px)
- Hover: lift effect + shadow increase
- Smooth transitions on all interactions

### Buttons

- Gradient backgrounds for primary actions
- Rounded corners (8px)
- Shadow on hover
- No uppercase transformation
- Icon + text combinations

### Inputs

- Outlined style with rounded corners
- Icons in prepend slots
- Shadow on focus
- Smooth transitions

### Headers

- Backdrop blur effect
- Gradient background
- Sticky positioning
- Shadow for depth

### Hero Sections

- Full viewport height
- Gradient overlays on images
- Animated background patterns (dots/grid)
- Staggered animation for children

## Layout Principles

1. **Spacing**: Consistent use of Quasar's spacing classes (q-pa, q-ma, q-gutter)
2. **Grid**: Responsive 12-column grid
3. **Whitespace**: Generous padding and margins
4. **Alignment**: Center-aligned hero content, left-aligned body content

## Accessibility

- High contrast ratios for text
- Focus indicators on interactive elements
- Smooth scroll behavior
- Keyboard navigation support

## Performance

- Hardware-accelerated animations (transform, opacity)
- Minimal repaints
- Lazy loading for images
- Optimized transitions

## Mobile First

- Responsive breakpoints
- Touch-friendly tap targets (min 44px)
- Simplified navigation on mobile
- Optimized font sizes

## Implementation Examples

### Glass Card

```vue
<q-card class="glass hover-lift">
  <q-card-section>
    Content here
  </q-card-section>
</q-card>
```

### Gradient Button

```vue
<q-btn
  unelevated
  rounded
  class="bg-gradient-primary text-white"
  label="Action"
  no-caps
/>
```

### Animated Section

```vue
<div class="stagger-children">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

### Hero Pattern

```vue
<div class="hero-section pattern-dots">
  <div class="fade-in">
    <h1>Title</h1>
  </div>
</div>
```

## CSS Variables

All design tokens are defined as CSS variables in `app.scss` for easy theming:

- `--gradient-primary`
- `--gradient-secondary`
- `--gradient-success`
- `--shadow-sm/md/lg/xl`
- `--border-radius`
- `--transition`

## Icons

Using Material Design Icons (MDI) via Quasar:

- mdi-briefcase (assignments)
- mdi-map-marker (locations)
- sports_soccer (teams)
- school (classes)
- groups (associations)
- business (organizations)
