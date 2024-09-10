// eslint-disable-next-line ts/ban-ts-comment
// @ts-ignore
import process from 'node:process';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default function defineBuildConfig(): ReturnType<typeof defineConfig> {
  const packagePath = process.cwd();
  const packageExtension = packagePath.split('/').pop();

  const packageName = `@traced-fabric/${packageExtension}`;

  return defineConfig({
    plugins: [
      dts({
        tsconfigPath: '../../tsconfig.base.json',
        include: ['src', 'index.ts'],
      }),
    ],

    build: {
      lib: {
        name: packageName,
        fileName: 'index',
        entry: Bun.resolveSync(packagePath, 'index.ts'),
      },

      minify: false,
      sourcemap: true,
    },
  });
}
