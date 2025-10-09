// src/webcomponents/uni-loader.ts
// Web component that implements multiple loader styles via `type` attribute.
// Attributes: type (spinner, dots, bars, bounce, skeleton), color, size, speed, variant
// Plus extended props: thickness, count, gap, rounded, easing, duration, delay, pause,
// role, label(aria-label), block, width, height, background-color, shimmer-color

function pxOr(value: string | number | undefined, fallback = '40') {
  if (value == null) return `${fallback}px`;
  const s = String(value).trim();
  return /^\d+(\.\d+)?$/.test(s) ? `${s}px` : s;
}

function parseSpeed(value: string | number | undefined) {
  const v = value == null ? 1 : Number(value);
  return isFinite(v) && v > 0 ? v : 1;
}

function parsePositiveNumber(value: string | number | undefined, fallback: number): number {
  const v = value == null ? fallback : Number(value);
  return isFinite(v) && v > 0 ? v : fallback;
}

function boolAttr(value: string | null | undefined): boolean {
  if (value == null) return false;
  const v = String(value).toLowerCase();
  return v === '' || v === 'true' || v === '1';
}

const cssCommon = (
  sizePx: string,
  color: string,
  durationSec: string,
  easing: string,
  paused: boolean,
  block: boolean
) => `
:host{display:${block ? 'block' : 'inline-block'}; width:${sizePx}; height:${sizePx}; line-height:0; vertical-align:middle;}
:host([hidden]){display:none}
.loader-wrap{width:100%;height:100%;display:flex;align-items:center;justify-content:center}
/* default variables */
:host{--ul-color:${color};--ul-duration:${durationSec};--ul-ease:${easing};--ul-play:${paused ? 'paused' : 'running'};}
`;

// Templates for types
function spinnerTemplate(sizePx: string, color: string, dur: string, easing: string, paused: boolean, variant: string, thickness: string) {
  const border = thickness || `calc(${sizePx} / 8)`;
  return `
  <style>
    ${cssCommon(sizePx, color, dur, easing, paused, false)}
    .spinner{
      box-sizing:border-box;
      width:${sizePx};
      height:${sizePx};
      ${variant === 'dual' ? `border:${border} solid rgba(0,0,0,0.12); border-top-color:${color}; border-right-color:${color};` : ''}
      ${variant === 'dashed' ? `border:${border} dashed rgba(0,0,0,0.24); border-top-color:${color};` : ''}
      ${variant === 'dotted' ? `border:${border} dotted rgba(0,0,0,0.24); border-top-color:${color};` : ''}
      ${!variant || (variant !== 'dual' && variant !== 'dashed' && variant !== 'dotted') ? `border:${border} solid rgba(0,0,0,0.12); border-top-color:${color};` : ''}
      border-radius:50%;
      animation:spin ${dur} ${easing} infinite;
      animation-play-state: var(--ul-play);
    }
    @keyframes spin{to{transform:rotate(360deg)}}
  </style>
  <div class="loader-wrap"><div class="spinner" role="status" aria-label="loading"></div></div>
  `;
}

function dotsTemplate(sizePx: string, color: string, dur: string, easing: string, paused: boolean, count: number, gap: string, rounded: string, variant: string, dotsMarkup: string) {
  const dotSize = `calc(${sizePx} / 5)`;
  return `
  <style>
    ${cssCommon(sizePx, color, dur, easing, paused, false)}
    .dots{display:flex;gap:${gap || `calc(${dotSize} / 2)`};align-items:center}
    .dot{width:${dotSize};height:${dotSize};border-radius:${rounded || '50%'};background:${color};opacity:0.85; animation:${variant === 'pulse' ? 'dotpulse' : variant === 'typing' ? 'dotblink' : 'dotbounce'} ${dur} ${easing} infinite; animation-play-state: var(--ul-play);}
    .dot:nth-child(2){animation-delay: calc(${dur} / 6)}
    .dot:nth-child(3){animation-delay: calc(${dur} / 3)}
    @keyframes dotbounce{0%,80%,100%{transform:translateY(0);opacity:0.7}40%{transform:translateY(-35%);opacity:1}}
    @keyframes dotpulse{0%,100%{transform:scale(0.7);opacity:0.6}50%{transform:scale(1);opacity:1}}
    @keyframes dotblink{0%,100%{opacity:0.2}50%{opacity:1}}
  </style>
  <div class="loader-wrap"><div class="dots" role="status" aria-label="loading">${dotsMarkup}</div></div>
  `;
}

function barsTemplate(sizePx: string, color: string, dur: string, easing: string, paused: boolean, count: number, gap: string, rounded: string, variant: string, barsMarkup: string) {
  const barWidth = `calc(${sizePx} / 7)`;
  const barHeight = `calc(${sizePx} / 1.6)`;
  return `
  <style>
    ${cssCommon(sizePx, color, dur, easing, paused, false)}
    .bars{display:flex;align-items:end;gap:${gap || `calc(${barWidth} / 2)`}}
    .bar{width:${barWidth};height:${barHeight};background:${color};animation:${variant === 'fade' ? 'barfade' : 'barstretch'} ${dur} ${easing} infinite;transform-origin:center bottom;border-radius:${rounded || '4px'};animation-play-state: var(--ul-play);}
    .bar:nth-child(2){animation-delay:calc(${dur} / 6)}
    .bar:nth-child(3){animation-delay:calc(${dur} / 3)}
    @keyframes barstretch{0%,100%{transform:scaleY(0.4)}50%{transform:scaleY(1)}}
    @keyframes barfade{0%,100%{opacity:0.3;transform:scaleY(0.5)}50%{opacity:1;transform:scaleY(1)}}
  </style>
  <div class="loader-wrap"><div class="bars" role="status" aria-label="loading">${barsMarkup}</div></div>
  `;
}

function bounceTemplate(sizePx: string, color: string, dur: string, easing: string, paused: boolean, count: number, gap: string, rounded: string, variant: string, ballsMarkup: string) {
  const dotSize = `calc(${sizePx} / 4.5)`;
  return `
  <style>
    ${cssCommon(sizePx, color, dur, easing, paused, false)}
    .wrap{display:flex;align-items:center;justify-content:center;gap:${gap || `calc(${dotSize} / 3)`}}
    .b{width:${dotSize};height:${dotSize};border-radius:${rounded || '50%'};background:${color};animation:${variant === 'scale' ? 'bscale' : 'bigbounce'} ${dur} ${easing} infinite;animation-play-state: var(--ul-play);}
    .b:nth-child(2){animation-delay:calc(${dur} / 6)}
    .b:nth-child(3){animation-delay:calc(${dur} / 3)}
    @keyframes bigbounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-40%)}}
    @keyframes bscale{0%,100%{transform:scale(0.7)}50%{transform:scale(1)}}
  </style>
  <div class="loader-wrap"><div class="wrap">${ballsMarkup}</div></div>
  `;
}

function skeletonTemplate(sizePx: string, color: string, dur: string, easing: string, paused: boolean, variant: string, widthCss: string | null, heightCss: string | null, bgColor: string | null, shimmerColor: string | null) {
  const w = widthCss || sizePx;
  const h = heightCss || `calc(${sizePx} / 5)`;
  const radius = variant === 'circle' ? '50%' : '8px';
  const base = bgColor || 'rgba(0,0,0,0.06)';
  const mid = shimmerColor || 'rgba(0,0,0,0.12)';
  return `
  <style>
    ${cssCommon(sizePx, color, dur, easing, paused, false)}
    .skeleton{width:${w};height:${h};border-radius:${radius};background:linear-gradient(90deg, ${base} 0%, ${mid} 50%, ${base} 100%);background-size:200% 100%;animation:shimmer ${dur} ${easing} infinite;animation-play-state: var(--ul-play);}
    @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
  </style>
  <div class="loader-wrap"><div class="skeleton" role="status" aria-label="loading"></div></div>
  `;
}

export class UniLoader extends HTMLElement {
  static get observedAttributes() {
    return [
      'type', 'color', 'size', 'speed', 'variant', 'aria-label',
      'thickness', 'count', 'gap', 'rounded', 'easing', 'duration', 'delay', 'pause',
      'role', 'block', 'width', 'height', 'background-color', 'shimmer-color'
    ];
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
    const durationAttr = this.getAttribute('duration');
    const durationSec = durationAttr ? `${parsePositiveNumber(durationAttr, 1)}s` : `${(1 / speedVal).toFixed(3)}s`;
    const easing = this.getAttribute('easing') || 'linear';
    const paused = boolAttr(this.getAttribute('pause'));
    const block = boolAttr(this.getAttribute('block'));

    const variant = (this.getAttribute('variant') || '').toLowerCase();
    const thickness = this.getAttribute('thickness') || '';
    const count = Math.max(1, Math.min(12, Math.floor(parsePositiveNumber(this.getAttribute('count') || undefined, 3))));
    const gap = this.getAttribute('gap') || '';
    const rounded = this.getAttribute('rounded') || '';
    const delay = this.getAttribute('delay') || '';

    const widthCss = this.getAttribute('width');
    const heightCss = this.getAttribute('height');
    const bgColor = this.getAttribute('background-color');
    const shimmerColor = this.getAttribute('shimmer-color');

    let html = '';
    switch (type) {
      case 'dots': {
        let dots = '';
        for (let i = 0; i < count; i++) dots += '<div class="dot"></div>';
        html = dotsTemplate(size, color, durationSec, easing, paused, count, gap, rounded, variant, dots);
        break;
      }
      case 'bars': {
        let bars = '';
        for (let i = 0; i < count; i++) bars += '<div class="bar"></div>';
        html = barsTemplate(size, color, durationSec, easing, paused, count, gap, rounded, variant, bars);
        break;
      }
      case 'bounce': {
        let balls = '';
        for (let i = 0; i < count; i++) balls += '<div class="b"></div>';
        html = bounceTemplate(size, color, durationSec, easing, paused, count, gap, rounded, variant, balls);
        break;
      }
      case 'skeleton': html = skeletonTemplate(size, color, durationSec, easing, paused, variant, widthCss, heightCss, bgColor, shimmerColor); break;
      case 'spinner':
      default:
        html = spinnerTemplate(size, color, durationSec, easing, paused, variant, thickness);
    }

    this._root.innerHTML = html;
    // optional delay support via inline style on first animated child
    if (delay) {
      const first = this._root.querySelector('[role="status"], .spinner, .dot, .bar, .b, .skeleton') as HTMLElement | null;
      if (first) first.style.animationDelay = String(delay);
    }
    // role and aria-label overrides
    const role = this.getAttribute('role');
    const label = this.getAttribute('label') || this.getAttribute('aria-label') || 'loading';
    const statusEl = this._root.querySelector('[role]') as HTMLElement | null;
    if (statusEl) {
      if (role) statusEl.setAttribute('role', role);
      statusEl.setAttribute('aria-label', label);
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
