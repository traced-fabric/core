import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      tsconfigPath: './tsconfig.json',
    }),
  ],

  build: {
    lib: {
      name: '@traced-fabric/core',
      fileName: 'index',
      entry: resolve(__dirname, 'index.ts'),
    },

    minify: false,
    sourcemap: true,
  },
});
