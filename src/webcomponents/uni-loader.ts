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
  return ['type', 'color', 'size', 'speed', 'variant', 'aria-label', 'position', 'blur'];
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
    // Visibility logic

    const type = (this.getAttribute('type') || 'spinner').toLowerCase();
    const color = this.getAttribute('color') || 'currentColor';
    const size = pxOr(this.getAttribute('size') || undefined, '40');
    const speedVal = parseSpeed(this.getAttribute('speed') || undefined);
    const durationSec = `${(1 / speedVal).toFixed(3)}s`;

    // Position logic
    const position = (this.getAttribute('position') || 'center').toLowerCase();
    let positionStyle = '';
    switch (position) {
      case 'center':
        positionStyle = 'position:fixed;top:0;left:0;width:100vw;height:100vh;display:flex;align-items:center;justify-content:center;z-index:9999;';
        break;
      case 'top-left':
        positionStyle = 'position:fixed;top:0;left:0;z-index:9999;display:flex;align-items:flex-start;justify-content:flex-start;width:100vw;height:100vh;';
        break;
      case 'top-right':
        positionStyle = 'position:fixed;top:0;right:0;z-index:9999;display:flex;align-items:flex-start;justify-content:flex-end;width:100vw;height:100vh;';
        break;
      case 'bottom-left':
        positionStyle = 'position:fixed;bottom:0;left:0;z-index:9999;display:flex;align-items:flex-end;justify-content:flex-start;width:100vw;height:100vh;';
        break;
      case 'bottom-right':
        positionStyle = 'position:fixed;bottom:0;right:0;z-index:9999;display:flex;align-items:flex-end;justify-content:flex-end;width:100vw;height:100vh;';
        break;
      default:
        positionStyle = '';
    }

    // Blur logic
    const blur = this.getAttribute('blur');
    let blurHtml = '';
    if (blur === 'true' || blur === '1') {
      blurHtml = `<div style=\"position:absolute;top:0;left:0;width:100vw;height:100vh;background:rgba(255,255,255,0.4);backdrop-filter:blur(6px);z-index:9998;\"></div>`;
    } else if (blur === 'dark') {
      blurHtml = `<div style=\"position:absolute;top:0;left:0;width:100vw;height:100vh;background:rgba(30,30,30,0.7);backdrop-filter:blur(6px);z-index:9998;\"></div>`;
    }

    let loaderHtml = '';
    switch (type) {
      case 'dots': loaderHtml = dotsTemplate(size, color, durationSec); break;
      case 'bars': loaderHtml = barsTemplate(size, color, durationSec); break;
      case 'bounce': loaderHtml = bounceTemplate(size, color, durationSec); break;
      case 'skeleton': loaderHtml = skeletonTemplate(size, color, durationSec); break;
      case 'spinner':
      default:
        loaderHtml = spinnerTemplate(size, color, durationSec);
    }

    // Compose final HTML
    if (positionStyle) {
      this._root.innerHTML = `<div style=\"${positionStyle}position:relative;\">${blurHtml}<div style=\"position:relative;z-index:10000;\">${loaderHtml}</div></div>`;
    } else {
      this._root.innerHTML = `${blurHtml}<div style=\"position:relative;z-index:10000;\">${loaderHtml}</div>`;
    }
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
