## 🌐 Universal Loaders

<a href="https://www.npmjs.com/package/universal-loaders"><img alt="npm" src="https://img.shields.io/npm/v/universal-loaders.svg?color=%234f46e5"></a>
<a href="https://www.npmjs.com/package/universal-loaders"><img alt="downloads" src="https://img.shields.io/npm/dm/universal-loaders.svg"></a>
<a href="https://github.com/SamithVinura/universal-loader/actions"><img alt="ci" src="https://img.shields.io/github/actions/workflow/status/SamithVinura/universal-loader/ci.yml?label=CI"></a>
<a href="https://github.com/SamithVinura/universal-loader"><img alt="license" src="https://img.shields.io/github/license/SamithVinura/universal-loader.svg"></a>

A lightweight, framework-agnostic loading indicator built as a Web Component. Works anywhere:
- React / Next.js
- Angular
- Vue
- Vanilla JS/TS

Zero external dependencies. Drop in elegant spinners, dots, bars, bounce, and skeleton loaders.

---

### Installation

```bash
npm install universal-loaders
# or
pnpm add universal-loaders
# or
yarn add universal-loaders
```

---

### Quick start (Vanilla)

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Universal Loaders</title>
    <script type="module">
      import { registerUniLoader } from 'universal-loaders';
      registerUniLoader();
    </script>
  </head>
  <body>
    <!-- defaults to type="spinner" -->
    <uni-loader></uni-loader>
    <uni-loader type="dots" color="#4f46e5" size="48" speed="1.5"></uni-loader>
  </body>
</html>
```

---

### Attributes API

Core:
- type: spinner | dots | bars | bounce | skeleton (default: spinner)
- color: Any CSS color (default: currentColor)
- size: Number in px or any CSS length (default: 40px)
- speed: Positive number; higher is faster (default: 1). If `duration` is set, it takes precedence
- variant: Visual variant per type (see below)
- aria-label / label: Accessible label; defaults to "loading"

Animation and behavior:
- duration: Direct seconds for one cycle, e.g., `1.2` (overrides `speed`)
- easing: CSS timing-function, e.g., `linear`, `ease-in-out`, or `cubic-bezier(...)`
- delay: Animation delay, e.g., `0.2s`
- pause: Boolean; pauses animation

Layout and sizing:
- block: Boolean; makes the host display block instead of inline-block
- width, height: Override skeleton width/height or non-square use cases
- gap: CSS length spacing for multi-part loaders (dots/bars/bounce)
- rounded: Boolean or CSS radius for dots/bounce bars rounding (e.g., `6px`)

Type-specific:
- thickness: Spinner border/line thickness (e.g., `4px`)
- count: Number of parts for dots/bars/bounce (1–12, default 3)
- background-color: Skeleton base background color
- shimmer-color: Skeleton highlight color

Variants by type:
- spinner: default | dual | dashed | dotted
- dots: default | pulse | typing
- bars: default | fade
- bounce: default | scale
- skeleton: default | circle (uses `width`/`height` to control size)

Examples:
```html
<!-- Spinner variants -->
<uni-loader type="spinner" size="40" />
<uni-loader type="spinner" variant="dual" thickness="4px" color="#4f46e5" />
<uni-loader type="spinner" variant="dashed" thickness="3px" easing="ease-in-out" />

<!-- Dots variants -->
<uni-loader type="dots" count="4" gap="8px" />
<uni-loader type="dots" variant="pulse" color="#10b981" />
<uni-loader type="dots" variant="typing" rounded="8px" />

<!-- Bars variants -->
<uni-loader type="bars" count="5" gap="6px" />
<uni-loader type="bars" variant="fade" easing="cubic-bezier(.2,.8,.2,1)" />

<!-- Bounce variants -->
<uni-loader type="bounce" />
<uni-loader type="bounce" variant="scale" count="4" gap="10px" />

<!-- Skeleton variants and sizing -->
<uni-loader type="skeleton" size="240px" />
<uni-loader type="skeleton" variant="circle" width="56px" height="56px" background-color="#eee" shimmer-color="#ddd" />

<!-- Behavior & layout -->
<uni-loader type="spinner" duration="0.8" pause />
<uni-loader type="bars" block style="width:120px;height:64px" />
```

Notes:
- `speed` is inverted to duration internally: duration = 1 / speed seconds. Use `duration` for precise control.
- By default the host uses `inline-block`; set `block` for full-width layouts.
- `rounded` accepts any CSS radius; when omitted, circles default to 50%.

---

### React usage

Use the Web Component directly (recommended; minimal surface area):

```tsx
// src/main.tsx or src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { registerUniLoader } from 'universal-loaders';

registerUniLoader(); // ensure the element is defined on the client

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

```tsx
// Any component
export function Example() {
  return (
    <div style={{ color: '#0ea5e9' }}>
      {/* Use the custom element in JSX */}
      <uni-loader type="dots" size={40} speed={1.2}></uni-loader>
    </div>
  );
}
```

Next.js (disable SSR for the element):

```tsx
// app/components/Loader.tsx
'use client';
import { useEffect } from 'react';
import { registerUniLoader } from 'universal-loaders';

export default function Loader() {
  useEffect(() => { registerUniLoader(); }, []);
  return <uni-loader type="spinner" size="32"></uni-loader>;
}
```

Optional React wrapper (if you prefer a React component interface):

```tsx
// Create locally in your app if you want typed props
import React, { useEffect } from 'react';
import { registerUniLoader } from 'universal-loaders';

type LoaderProps = {
  type?: 'spinner' | 'dots' | 'bars' | 'bounce' | 'skeleton';
  color?: string;
  size?: number | string;
  speed?: number | string;
  variant?: string;
  className?: string;
  style?: React.CSSProperties;
  thickness?: string;
  count?: number;
  gap?: string;
  rounded?: string | boolean;
  easing?: string;
  duration?: number | string;
  delay?: string;
  pause?: boolean;
  block?: boolean;
  width?: string;
  height?: string;
  ['background-color']?: string;
  ['shimmer-color']?: string;
  label?: string;
};

export const Loader: React.FC<LoaderProps> = ({ className, style, ...rest }) => {
  useEffect(() => { registerUniLoader(); }, []);
  return React.createElement('uni-loader', { class: className, style, ...rest });
};
```

---

### Angular usage

Step 1: Register the element on the client (e.g., in `main.ts`):

```ts
// main.ts
import { registerUniLoader } from 'universal-loaders';
registerUniLoader();
```

Step 2: Allow the custom element schema in your module (Angular 12+):

```ts
// app.module.ts
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
```

Step 3: Use it in templates:

```html
<!-- app.component.html -->
<section style="color:#4f46e5">
  <uni-loader type="bars" size="48" speed="1.6"></uni-loader>
</section>
```

SSR (Angular Universal) note: Call `registerUniLoader()` only on the browser. For example:

```ts
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';

constructor(@Inject(PLATFORM_ID) platformId: Object) {
  if (isPlatformBrowser(platformId)) {
    import('universal-loaders').then(m => m.registerUniLoader());
  }
}
```

---

### Vue usage (Vue 3)

Step 1: Register once on app init:

```ts
// main.ts
import { createApp } from 'vue';
import App from './App.vue';
import { registerUniLoader } from 'universal-loaders';

registerUniLoader();

createApp(App).mount('#app');
```

Step 2: Use in SFC templates:

```vue
<template>
  <div style="color:#16a34a">
    <uni-loader type="bounce" :size="40" :speed="1.3" />
  </div>
</template>
```

Nuxt 3 note (client only plugin):

```ts
// plugins/universal-loaders.client.ts
import { registerUniLoader } from 'universal-loaders';
export default () => registerUniLoader();
```

---

### Live demos

- React (StackBlitz): https://stackblitz.com/fork/react?file=src%2FApp.tsx
- Angular (StackBlitz): https://stackblitz.com/fork/angular
- Vue 3 (StackBlitz): https://stackblitz.com/fork/vue

In each starter, add the dependency `universal-loaders` and call `registerUniLoader()` at app startup, then drop `<uni-loader>` into your component/templates.

---

### Theming, sizing, and speed

- Inherit color via currentColor:
```css
.container { color: #9333ea; }
```
```html
<div class="container">
  <uni-loader type="dots"></uni-loader>
</div>
```

- Set explicit size:
```html
<uni-loader size="64"></uni-loader>
<uni-loader size="2.5rem"></uni-loader>
```

- Tune speed (higher = faster):
```html
<uni-loader speed="2"></uni-loader>
<uni-loader speed="0.75"></uni-loader>
```

---

### Accessibility

- Each template renders with `role="status"` and `aria-label="loading"` by default.
- Override `aria-label` for context-specific messaging:
```html
<uni-loader aria-label="Fetching profile"></uni-loader>
```

---

### CDN usage

If your bundler supports ESM URLs, you can load directly from a CDN. Example with `esm.sh`:

```html
<script type="module">
  import { registerUniLoader } from 'https://esm.sh/universal-loaders';
  registerUniLoader();
</script>
```

Or with `unpkg` ESM entry:

```html
<script type="module" src="https://unpkg.com/universal-loaders@latest/dist/index.esm.js"></script>
<script>
  customElements.get('uni-loader') || customElements.whenDefined('uni-loader');
</script>
```

---

### Troubleshooting

- React/Next: "customElements is not defined" on server
  - Ensure `registerUniLoader()` only runs on the client. In Next.js, place usage in a `use client` component.
- Angular: "'uni-loader' is not a known element"
  - Add `CUSTOM_ELEMENTS_SCHEMA` to your `@NgModule.schemas`.
- Vue: Unknown custom element warning
  - Make sure `registerUniLoader()` runs before mounting the app (or use a Nuxt client plugin).
- Styles not applying
  - The loader uses Shadow DOM, but `color` still inherits via `currentColor`. Set color on a container or pass `color` attribute.
- Size looks off
  - Numbers are treated as px. Use a full CSS unit string for rem/em, e.g., `size="2rem"`.

---

### Versioning

This project follows Semantic Versioning (SemVer). See GitHub Releases for changelog and upgrade notes.

- Releases: https://github.com/SamithVinura/universal-loader/releases

---

### License

MIT © Samith Aberathne
