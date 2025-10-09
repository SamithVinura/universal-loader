⚙️ Usage Guide
🧩 Step 1 — Register the Web Component

You must register the custom element once in your app before using it.

import { registerUniLoader } from "universal-loaders";
registerUniLoader();


This function registers <uni-loader> globally, making it available in your app.

⚛️ React / Next.js Example
import { useEffect } from "react";
import { registerUniLoader } from "universal-loaders";

export default function App() {
  useEffect(() => {
    registerUniLoader();
  }, []);

  return (
    <div>
      <h2>Loading Data...</h2>
      <uni-loader
        type="spinner"
        color="#007bff"
        size="60"
        speed="1.2"
        position="center"
        blur="dark"
      ></uni-loader>
    </div>
  );
}


✅ Works perfectly in React, Next.js, Vite, or CRA projects.
No additional dependencies or wrappers needed.

🅰️ Angular Example

app.component.ts

import { Component, OnInit } from "@angular/core";
import { registerUniLoader } from "universal-loaders";

@Component({
  selector: "app-root",
  template: `
    <div class="container">
      <h3>Angular Universal Loader</h3>
      <uni-loader
        type="bars"
        color="#ff4081"
        size="50"
        position="center"
      ></uni-loader>
    </div>
  `,
})
export class AppComponent implements OnInit {
  ngOnInit() {
    registerUniLoader();
  }
}

🧱 Vue 3 Example

App.vue

<script setup>
import { onMounted } from "vue";
import { registerUniLoader } from "universal-loaders";

onMounted(() => registerUniLoader());
</script>

<template>
  <div>
    <h2>Vue Universal Loader</h2>
    <uni-loader type="dots" color="orange" size="48"></uni-loader>
  </div>
</template>

🌍 Vanilla JavaScript Example
<script type="module">
  import { registerUniLoader } from "universal-loaders";
  registerUniLoader();
</script>

<uni-loader type="bounce" color="green" size="60" position="center"></uni-loader>

🧩 Available Props (Attributes)
Attribute	Type	Default	Description
type	"spinner", "bars", "dots", "bounce", "skeleton"	"spinner"	Loader style
color	string	#333	Color of loader
size	number | string	40	Size in px
speed	number	1	Speed multiplier (e.g., 0.5 slower, 2 faster)
position	"center", "top-left", "top-right", "bottom-left", "bottom-right"	"center"	Loader placement
blur	"true", "dark", "light", "false"	"false"	Optional background blur / dim
style	string	—	Inline CSS for advanced customization
✨ Example Variants
<uni-loader type="spinner" color="#007bff" size="50"></uni-loader>
<uni-loader type="bars" color="#ff9800" size="40" speed="1.5"></uni-loader>
<uni-loader type="dots" color="green" position="bottom-right"></uni-loader>
<uni-loader type="bounce" color="#e91e63" blur="dark"></uni-loader>
<uni-loader type="skeleton" color="#ddd"></uni-loader>
