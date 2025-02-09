/// <reference types="vitest" />

import { defineConfig, splitVendorChunkPlugin } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import { offsetFromRoot } from '@nrwl/devkit';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    root: 'src',
    publicDir: 'assets',
    server: {
      port: 3000,
    },
    build: {
      rollupOptions: {
        external: [/ngResource/],
        onwarn: (warning, warn) => {
          if (warning.message.includes('ngResource')) {
            return;
          }
          warn(warning);
          },
      },
      outDir: `${offsetFromRoot('apps/my-app/src')}/dist/apps/my-app`,
      emptyOutDir: true,
      target: 'es2020',
    },
    resolve: {
      mainFields: ['module'],
    },
    plugins: [
      angular({
        inlineStylesExtension: 'scss',
      }),
      splitVendorChunkPlugin(),
    ],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['test-setup.ts'],
      include: ['**/*.spec.ts'],
      cache: {
        dir: `${offsetFromRoot('apps/my-app/src')}/node_modules/.vitest`,
      },
    },
    define: {
      'import.meta.vitest': mode !== 'production',
    },
  };
});