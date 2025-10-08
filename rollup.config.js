import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/index.ts',
  output: [
    { file: 'dist/index.esm.js', format: 'es', sourcemap: true },
    { file: 'dist/index.cjs.js', format: 'cjs', sourcemap: true, exports: 'named' }
  ],
  plugins: [
    resolve({ browser: true }),
    commonjs(),
    typescript({ tsconfig: './tsconfig.json', useTsconfigDeclarationDir: true }),
    terser()
  ],
  external: [] // you can add peer deps like 'react' here if you prefer omitted from bundle
};
