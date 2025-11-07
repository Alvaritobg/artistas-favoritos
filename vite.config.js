import { defineConfig } from 'vite';
export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://theaudiodb.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
