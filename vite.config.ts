import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['assets/*.{png,gif,jpg,ttf}'],
  build: {
    rollupOptions: {
      output: {
        manualChunks: id => {
          if (!id.includes('node_modules')) return 'index';
          if (id.includes('@mantine')) return 'mantine';
          if (id.includes('three')) return 'three';
          return 'vendor';
        },
      },
    },
  },
});
