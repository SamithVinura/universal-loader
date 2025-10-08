# Angular usage of universal-loaders

A few notes to use the `<uni-loader>` web component in Angular projects:

1. Register the web component on the browser (client) side. In `main.ts` or in a component's `ngOnInit`, dynamically import the library:

```ts
// main.ts (example)
if (typeof window !== 'undefined') {
  import('@web-app/universal-loaders').then(() => {
    // web component auto-registered by package
  });
}
