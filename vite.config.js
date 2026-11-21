import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 部署目标：GitHub Pages 根站点 https://999888666jiang-dev.github.io/
// 根站点 base 为 '/'；若改为项目站，必须同步改成 '/<repo>/'（R-07）。
export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true
  },
  preview: {
    host: '127.0.0.1',
    port: 5174,
    strictPort: true
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2022',
    sourcemap: false
  }
});
