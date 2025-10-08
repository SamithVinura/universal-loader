// Vue 3 wrapper. Exports a defineComponent that renders <uni-loader> and lazy-registers the component.
import { defineComponent, h, onMounted } from 'vue';

export default defineComponent({
  name: 'UniLoader',
  props: {
    type: { type: String, default: 'spinner' },
    color: { type: String, default: undefined },
    size: { type: [String, Number], default: undefined },
    speed: { type: [String, Number], default: undefined },
    variant: { type: String, default: undefined }
  },
  setup(props, { attrs }) {
    onMounted(async () => {
      if (typeof window !== 'undefined' && !customElements.get('uni-loader')) {
        await import('../../webcomponents/uni-loader');
      }
    });
    return () =>
      h(
        'uni-loader',
        {
          type: props.type,
          color: props.color,
          size: props.size == null ? undefined : String(props.size),
          speed: props.speed == null ? undefined : String(props.speed),
          variant: props.variant,
          ...attrs
        },
        []
      );
  }
});
