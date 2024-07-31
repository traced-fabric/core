import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [dts({ rollupTypes: true })],

  build: {
    lib: {
      name: '@traced-fabric/core',
      fileName: 'index',
      entry: resolve(__dirname, 'index.ts'),
    },
  },
});
