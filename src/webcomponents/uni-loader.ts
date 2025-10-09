// universal-loader.ts
// FINAL SCROLLBAR-SAFE VERSION WITH BODY SCROLL LOCK FIXED

function pxOr(value: string | number | undefined, fallback = '40') {
  if (value == null) return `${fallback}px`;
  const s = String(value).trim();
  return /^\d+(\.\d+)?$/.test(s) ? `${s}px` : s;
}

function parseSpeed(value: string | number | undefined) {
  const v = value == null ? 1 : Number(value);
  return isFinite(v) && v > 0 ? v : 1;
}

const cssCommon = (sizePx: string) => `
:host {
  display: inline-block;
  width: ${sizePx};
  height: ${sizePx};
}
:host([hidden]) { display: none; }
.loader-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
`;

function spinnerTemplate(sizePx: string, color: string, dur: string) {
  const border = `calc(${sizePx} / 8)`;
  return `
  <style>
    ${cssCommon(sizePx)}
    .spinner {
      width: ${sizePx};
      height: ${sizePx};
      border: ${border} solid rgba(0,0,0,0.12);
      border-top-color: ${color};
      border-radius: 50%;
      animation: spin ${dur} linear infinite;
      will-change: transform;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  </style>
  <div class="loader-wrap">
    <div class="spinner" role="status" aria-label="loading"></div>
  </div>
  `;
}

function dotsTemplate(sizePx: string, color: string, dur: string) {
  const dotSize = `calc(${sizePx} / 5)`;
  return `
  <style>
    ${cssCommon(sizePx)}
    .dots { display: flex; gap: calc(${dotSize} / 2); }
    .dot {
      width: ${dotSize};
      height: ${dotSize};
      border-radius: 50%;
      background: ${color};
      animation: bounce ${dur} ease-in-out infinite;
      will-change: transform;
    }
    .dot:nth-child(2){animation-delay: calc(${dur} / 6);}
    .dot:nth-child(3){animation-delay: calc(${dur} / 3);}
    @keyframes bounce {
      0%,80%,100% { transform: translateY(0); opacity: 0.7; }
      40% { transform: translateY(-35%); opacity: 1; }
    }
  </style>
  <div class="loader-wrap">
    <div class="dots">
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
    </div>
  </div>
  `;
}

function barsTemplate(sizePx: string, color: string, dur: string) {
  const barWidth = `calc(${sizePx} / 7)`;
  const barHeight = `calc(${sizePx} / 1.6)`;
  return `
  <style>
    ${cssCommon(sizePx)}
    .bars { display: flex; align-items: end; gap: calc(${barWidth} / 2); }
    .bar {
      width: ${barWidth};
      height: ${barHeight};
      background: ${color};
      animation: stretch ${dur} ease-in-out infinite;
      transform-origin: center bottom;
      border-radius: 4px;
      will-change: transform;
    }
    .bar:nth-child(2){animation-delay: calc(${dur} / 6);}
    .bar:nth-child(3){animation-delay: calc(${dur} / 3);}
    @keyframes stretch {
      0%,100% { transform: scaleY(0.4); }
      50% { transform: scaleY(1); }
    }
  </style>
  <div class="loader-wrap">
    <div class="bars">
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
    </div>
  </div>
  `;
}

export class UniLoader extends HTMLElement {
  static get observedAttributes() {
    return ['type', 'color', 'size', 'speed', 'position', 'blur', 'fullscreen'];
  }

  private _root: ShadowRoot;

  constructor() {
    super();
    this._root = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.lockBodyScroll(true);
  }

  disconnectedCallback() {
    this.lockBodyScroll(false);
  }

  attributeChangedCallback() {
    this.render();
  }

  private lockBodyScroll(lock: boolean) {
    if (this.getAttribute('fullscreen') === 'false') return;
    if (lock) {
      document.body.dataset.scrollLock = 'true';
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden'; // Ensure no scrollbar from html
    } else if (document.body.dataset.scrollLock === 'true') {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      delete document.body.dataset.scrollLock;
    }
  }

  render() {
    const type = (this.getAttribute('type') || 'spinner').toLowerCase();
    const color = this.getAttribute('color') || 'currentColor';
    const size = pxOr(this.getAttribute('size') ?? undefined, '40');
    const speedVal = parseSpeed(this.getAttribute('speed') ?? undefined);
    const dur = `${(1 / speedVal).toFixed(3)}s`;

    const fullscreen = this.getAttribute('fullscreen') !== 'false';
    const position = (this.getAttribute('position') || 'center').toLowerCase();

    let containerStyle = '';
    if (fullscreen) {
      containerStyle = `
        position: fixed;
        inset: 0;
        overflow: hidden;
        display: flex;
        align-items: ${position.includes('bottom') ? 'flex-end' : position.includes('top') ? 'flex-start' : 'center'};
        justify-content: ${position.includes('left') ? 'flex-start' : position.includes('right') ? 'flex-end' : 'center'};
        z-index: 9999;
      `;
    }

    const blur = this.getAttribute('blur');
    let blurHtml = '';
    if (blur === 'true' || blur === 'light') {
      blurHtml = `<div style="position:absolute;inset:0;background:rgba(255,255,255,0.4);backdrop-filter:blur(6px);z-index:9998;"></div>`;
    } else if (blur === 'dark') {
      blurHtml = `<div style="position:absolute;inset:0;background:rgba(0,0,0,0.5);backdrop-filter:blur(6px);z-index:9998;"></div>`;
    } else if (blur?.startsWith('rgba')) {
      blurHtml = `<div style="position:absolute;inset:0;background:${blur};z-index:9998;"></div>`;
    }

    let loaderHtml = '';
    switch (type) {
      case 'dots':
        loaderHtml = dotsTemplate(size, color, dur);
        break;
      case 'bars':
        loaderHtml = barsTemplate(size, color, dur);
        break;
      default:
        loaderHtml = spinnerTemplate(size, color, dur);
    }

    this._root.innerHTML = `
      <div style="${containerStyle}">
        ${blurHtml}
        <div style="position:relative;z-index:10000;">${loaderHtml}</div>
      </div>
    `;
  }
}

export function registerUniLoader() {
  if (typeof window !== 'undefined' && !customElements.get('uni-loader')) {
    customElements.define('uni-loader', UniLoader);
  }
}

if (typeof window !== 'undefined') registerUniLoader();
