import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@atoms': path.resolve(__dirname, '../../atoms/aitom_family'),
      '@fonts': path.resolve(__dirname, '../../fonts'),
    },
  },
  server: {
    fs: {
      // Allow serving files from one level up to the project root
      allow: ['..', '../../'],
    },
  },
});
