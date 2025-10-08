// React wrapper (TSX). Exports a simple Loader component that uses the <uni-loader> element.
// Works in JS & TS React projects. For server-side frameworks (Next) wrap with dynamic import / SSR false.

import React, { useEffect } from 'react';

export type LoaderProps = {
  type?: 'spinner' | 'dots' | 'bars' | 'bounce' | 'skeleton';
  color?: string;
  size?: number | string;
  speed?: number | string;
  variant?: string;
  className?: string;
  style?: React.CSSProperties;
};

async function ensureRegistered() {
  if (typeof window !== 'undefined' && !customElements.get('uni-loader')) {
    // dynamic import ensures code runs only on client
    await import('../../webcomponents/uni-loader');
  }
}

const toAttr = (v: any) => (v == null ? undefined : String(v));

export const Loader: React.FC<LoaderProps> = (props) => {
  useEffect(() => {
    ensureRegistered();
  }, []);

  const { type, color, size, speed, variant, className, style, ...rest } = props as any;
  // React uses 'className' but HTML custom element expects 'class'
  const attrs: any = {
    type,
    color,
    size: toAttr(size),
    speed: toAttr(speed),
    variant,
    class: className,
    style: style as any,
    ...rest
  };

  return React.createElement('uni-loader', attrs);
};

export default Loader;
