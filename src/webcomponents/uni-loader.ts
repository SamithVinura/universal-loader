// src/webcomponents/uni-loader.ts
// Web component that implements multiple loader styles via `type` attribute.
// Attributes: type (spinner, dots, bars, bounce, skeleton), color, size, speed, variant

function pxOr(value: string | number | undefined, fallback = '40') {
  if (value == null) return `${fallback}px`;
  const s = String(value).trim();
  return /^\d+(\.\d+)?$/.test(s) ? `${s}px` : s;
}

function parseSpeed(value: string | number | undefined) {
  const v = value == null ? 1 : Number(value);
  return isFinite(v) && v > 0 ? v : 1;
}

const cssCommon = (sizePx: string, color: string, durationSec: string) => `
:host{display:inline-block; width:${sizePx}; height:${sizePx}; line-height:0; vertical-align:middle;}
:host([hidden]){display:none}
.loader-wrap{width:100%;height:100%;display:flex;align-items:center;justify-content:center}
`;

// Templates for types
function spinnerTemplate(sizePx: string, color: string, dur: string) {
  const border = `calc(${sizePx} / 8)`;
  return `
  <style>
    ${cssCommon(sizePx, color, dur)}
    .spinner{
      box-sizing:border-box;
      width:${sizePx};
      height:${sizePx};
      border:${border} solid rgba(0,0,0,0.12);
      border-top-color:${color};
      border-radius:50%;
      animation:spin ${dur} linear infinite;
    }
    @keyframes spin{to{transform:rotate(360deg)}}
  </style>
  <div class="loader-wrap"><div class="spinner" role="status" aria-label="loading"></div></div>
  `;
}

function dotsTemplate(sizePx: string, color: string, dur: string) {
  const dotSize = `calc(${sizePx} / 5)`;
  return `
  <style>
    ${cssCommon(sizePx, color, dur)}
    .dots{display:flex;gap:calc(${dotSize} / 2);align-items:center}
    .dot{width:${dotSize};height:${dotSize};border-radius:50%;background:${color};opacity:0.85; animation:bounce ${dur} ease-in-out infinite}
    .dot:nth-child(2){animation-delay: calc(${dur} / 6)}
    .dot:nth-child(3){animation-delay: calc(${dur} / 3)}
    @keyframes bounce{0%,80%,100%{transform:translateY(0);opacity:0.7}40%{transform:translateY(-35%);opacity:1}}
  </style>
  <div class="loader-wrap"><div class="dots" role="status" aria-label="loading"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div></div>
  `;
}

function barsTemplate(sizePx: string, color: string, dur: string) {
  const barWidth = `calc(${sizePx} / 7)`;
  const barHeight = `calc(${sizePx} / 1.6)`;
  return `
  <style>
    ${cssCommon(sizePx, color, dur)}
    .bars{display:flex;align-items:end;gap:calc(${barWidth} / 2)}
    .bar{width:${barWidth};height:${barHeight};background:${color};animation:stretch ${dur} ease-in-out infinite;transform-origin:center bottom;border-radius:4px}
    .bar:nth-child(2){animation-delay:calc(${dur} / 6)}
    .bar:nth-child(3){animation-delay:calc(${dur} / 3)}
    @keyframes stretch{0%,100%{transform:scaleY(0.4)}50%{transform:scaleY(1)}}
  </style>
  <div class="loader-wrap"><div class="bars" role="status" aria-label="loading"><div class="bar"></div><div class="bar"></div><div class="bar"></div></div></div>
  `;
}

function bounceTemplate(sizePx: string, color: string, dur: string) {
  const dotSize = `calc(${sizePx} / 4.5)`;
  return `
  <style>
    ${cssCommon(sizePx, color, dur)}
    .wrap{display:flex;align-items:center;justify-content:center;gap:calc(${dotSize} / 3)}
    .b{width:${dotSize};height:${dotSize};border-radius:50%;background:${color};animation:bigbounce ${dur} cubic-bezier(.2,.8,.2,1) infinite}
    .b:nth-child(2){animation-delay:calc(${dur} / 6)}
    .b:nth-child(3){animation-delay:calc(${dur} / 3)}
    @keyframes bigbounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-40%)}}
  </style>
  <div class="loader-wrap"><div class="wrap"><div class="b"></div><div class="b"></div><div class="b"></div></div></div>
  `;
}

function skeletonTemplate(sizePx: string, color: string, dur: string) {
  const w = sizePx;
  const h = `calc(${sizePx} / 5)`;
  return `
  <style>
    ${cssCommon(sizePx, color, dur)}
    .skeleton{width:${w};height:${h};border-radius:8px;background:linear-gradient(90deg, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.12) 50%, rgba(0,0,0,0.06) 100%);background-size:200% 100%;animation:shimmer ${dur} linear infinite}
    @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
  </style>
  <div class="loader-wrap"><div class="skeleton" role="status" aria-label="loading"></div></div>
  `;
}

export class UniLoader extends HTMLElement {
  static get observedAttributes() {
    return ['type', 'color', 'size', 'speed', 'variant', 'aria-label'];
  }

  private _root: ShadowRoot;

  constructor() {
    super();
    this._root = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const type = (this.getAttribute('type') || 'spinner').toLowerCase();
    const color = this.getAttribute('color') || 'currentColor';
    const size = pxOr(this.getAttribute('size') || undefined, '40');
    const speedVal = parseSpeed(this.getAttribute('speed') || undefined);
    // animation duration: smaller speed -> slower, so we invert: higher speed -> shorter duration
    const durationSec = `${(1 / speedVal).toFixed(3)}s`;

    let html = '';
    switch (type) {
      case 'dots': html = dotsTemplate(size, color, durationSec); break;
      case 'bars': html = barsTemplate(size, color, durationSec); break;
      case 'bounce': html = bounceTemplate(size, color, durationSec); break;
      case 'skeleton': html = skeletonTemplate(size, color, durationSec); break;
      case 'spinner':
      default:
        html = spinnerTemplate(size, color, durationSec);
    }

    this._root.innerHTML = html;
  }
}

// Export register function
export function registerUniLoader() {
  if (typeof window !== 'undefined' && !customElements.get('uni-loader')) {
    customElements.define('uni-loader', UniLoader);
  }
}

// Auto-register if loaded in browser (convenience)
if (typeof window !== 'undefined') {
  try {
    registerUniLoader();
  } catch (err) {
    // swallow
  }
}
