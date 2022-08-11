import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';

import { peerDependencies } from './package.json';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'index.ts'),
      name: '@jenga-ui/core',
      fileName: 'index',
    },
    rollupOptions: {
      external: Object.keys(peerDependencies),
      output: {
        globals: {
          react: 'React',
        },
      },
    },
  },
});
