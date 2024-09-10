import type { UserConfig } from 'vite';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default function defineBuildConfig(options: {
  externals?: UserConfig['build']['rollupOptions']['external'];
}): ReturnType<typeof defineConfig> {
  // eslint-disable-next-line node/prefer-global/process
  const packagePath = process.cwd();
  const packageExtension = packagePath.split('/').pop();

  const packageName = `@traced-fabric/${packageExtension}`;
  const packageEntry = Bun.resolveSync(packagePath, 'index.ts');

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
        entry: packageEntry,
      },

      minify: false,
      sourcemap: true,

      rollupOptions: {
        external: options.externals,
      },
    },
  });
}
