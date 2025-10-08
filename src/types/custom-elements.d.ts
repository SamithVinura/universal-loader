export interface UniLoaderElement extends HTMLElement {
  type?: 'spinner' | 'dots' | 'bars' | 'bounce' | 'skeleton';
  color?: string;
  size?: string | number;
  speed?: string | number;
  variant?: string;
}

declare global {
  interface HTMLElementTagNameMap {
    'uni-loader': UniLoaderElement;
  }
  namespace JSX {
    interface IntrinsicElements {
      'uni-loader': any;
    }
  }
}

export {};
