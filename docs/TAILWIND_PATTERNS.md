# Tailwind CSS Patterns

This document describes the Tailwind CSS patterns used in this project after Phase 3 migration.

## Overview

The project has been successfully migrated from CSS modules to Tailwind CSS utility classes, while preserving complex custom animations in dedicated CSS files.

## File Structure

```
src/
├── styles/
│   └── tailwind.css          # Main Tailwind entry point
├── css/
│   ├── checkbox.css           # Custom checkbox animations (preserved)
│   └── launch.css             # Text-stroke animations & reset button (preserved)
└── utils/
    └── classNameUtils.ts      # cn() utility for class composition
```

## Class Composition Utility

Use the `cn()` utility function to compose Tailwind classes with conditional logic:

```tsx
import { cn } from 'utils/classNameUtils';

<button className={cn(
  'w-12 h-12 rounded-full',
  'bg-rest-color',
  isActive && 'bg-active-color'
)} />
```

The `cn()` function combines:
- **clsx**: Conditional class names
- **tailwind-merge**: Proper Tailwind class precedence

## Custom Theme Colors

All theme colors are defined in `tailwind.config.js`:

```javascript
colors: {
  'background-primary': '#171519',
  'rest-color': '#9b9dad',
  'active-color': '#b68672',
  'urban-theme': '#e96929',
  'rural-theme': '#80c080',
  'classy-theme': '#ef5555',
  'chill-theme': '#9fa8da',
  'graphics-theme': '#000000',
}
```

Use these colors directly in Tailwind classes:

```tsx
<div className="bg-background-primary text-white" />
<button className="bg-urban-theme hover:bg-urban-active" />
```

## Preserved Custom CSS

### Checkbox Animations (`checkbox.css`)

Complex toggle animations with pseudo-elements and keyframes are preserved in `checkbox.css`. This includes:
- Toggle track and thumb animations
- Theme-specific background colors
- Bounce-in/bounce-out keyframe animations

Import handled automatically via `tailwind.css`.

### Launch Screen Animations (`launch.css`)

Text stroke animations and reset button styles are preserved:
- SVG text stroke animations (`textStrokeAnim`)
- Reset button with complex `::before` and `::after` pseudo-elements
- Responsive checkbox container media queries

Import handled in `LaunchScreen.tsx`.

### Title Color Animation (`tailwind.css`)

The main title letter-by-letter color gradient animation uses CSS custom properties:

```css
.main__title-letter {
  color: hsl(calc(...), 100%, 50%);
}
```

This is preserved in `tailwind.css` because it requires dynamic CSS custom properties.

## Common Patterns

### Button Styles

```tsx
<button className={cn(
  'w-12 h-12 rounded-full',
  'absolute bottom-0 left-0',
  'border-0 p-0',
  'bg-rest-color',
  'transition-transform duration-200',
  'active:scale-95 active:bg-active-color'
)} />
```

### Layout Containers

```tsx
<div className={cn(
  'flex flex-col justify-center items-center',
  'm-8'
)}>
```

### Conditional Styling

```tsx
<button className={cn(
  'bg-no-repeat bg-center',
  isAudioMuted ? 'bg-rest-color' : 'bg-active-color'
)} />
```

## Responsive Design

Tailwind includes responsive utilities by default. Use breakpoint prefixes:

```tsx
<div className="w-full md:w-1/2 lg:w-1/3" />
```

Custom responsive behavior for checkbox container is in `launch.css`:

```css
@media (max-width: 1200px) {
  .checkbox-container > div {
    width: 50%;
  }
}

@media (max-width: 800px) {
  .checkbox-container {
    flex-direction: column;
  }
}
```

## Production Build

Tailwind CSS is optimized for production via PurgeCSS:

```javascript
// tailwind.config.js
content: [
  "./src/**/*.{js,jsx,ts,tsx}",
],
```

This ensures only used classes are included in the production bundle.

## Migration Notes

### Migrated to Tailwind

- Base styles (html, body, #root)
- Button styles (navigate, mute)
- Layout containers
- Spacing and positioning
- Text colors and backgrounds

### Preserved in Custom CSS

- Checkbox toggle animations (complex keyframes)
- Text stroke SVG animations
- Reset button (complex pseudo-elements)
- Title letter color gradient (CSS custom properties)

## Best Practices

1. **Use `cn()` for all className compositions**
2. **Prefer Tailwind utilities over inline styles**
3. **Use theme colors from config** instead of hardcoded hex values
4. **Keep complex animations in CSS files** when they involve:
   - Multiple keyframes
   - Complex pseudo-elements
   - CSS custom property calculations
5. **Use single quotes** for consistency with ESLint config
6. **Maintain 2-space indentation** for ESLint compliance
