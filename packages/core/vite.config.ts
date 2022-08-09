import { defineConfig } from 'vite';
import path from 'path';
import tsconfigPaths from "vite-tsconfig-paths";
import react from '@vitejs/plugin-react';
import {peerDependencies} from './package.json';

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths()
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'index.ts'),
      name: 'jenga-ui',
      formats: ['es', 'cjs'],
      fileName: 'index',
    },
    rollupOptions: {
      external: [...Object.keys(peerDependencies)],
      output: {
        globals: {
          react: 'React',
        },
      },
    },
  },
});
