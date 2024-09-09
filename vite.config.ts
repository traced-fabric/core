import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default function defineBuildConfig(): ReturnType<typeof defineConfig> {
  const packageExtension = __dirname.split('/').pop();

  const packageName = `@traced-fabric/${packageExtension}`;
  const packagePath = __dirname.concat(`/packages/${packageExtension}`);

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
