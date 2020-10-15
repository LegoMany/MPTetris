import resolve from '@rollup/plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import typescript from '@rollup/plugin-typescript';
import htmlTemplate from 'rollup-plugin-generate-html-template';
import eslint from '@rbnlffl/rollup-plugin-eslint';

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/script.js',
    format: 'iife',
  },
  plugins: [
    eslint({
      extensions: ['.ts', '.js']
    }),
    resolve({
      browser: true,
    }),
    commonjs(),
    typescript(),
    htmlTemplate({
      template: 'src/index.html',
      target: 'dist/index.html',
    })
  ],
};
