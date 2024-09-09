import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default function defineBuildConfig(options: {
  packageExtension: string;
}): ReturnType<typeof defineConfig> {
  const packagePath = `/packages/${options.packageExtension}`;

  return defineConfig({
    plugins: [
      dts({
        tsconfigPath: '../../tsconfig.base.json',
        include: ['src', 'index.ts'],
      }),
    ],

    build: {
      lib: {
        name: `@traced-fabric/${options.packageExtension}`,
        fileName: 'index',
        entry: Bun.resolveSync(__dirname.concat(packagePath), 'index.ts'),
      },

      minify: false,
      sourcemap: true,
    },
  });
}
