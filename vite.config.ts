import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

const staticPagesPlugin = {
  name: 'static-html-pages',
  configureServer(server: any) {
    server.middlewares.use((req: any, res: any, next: any) => {
      const url = (req.url ?? '/').split('?')[0].replace(/\/+$/, '') || '/';
      if (url === '/') return next();
      const candidates = [
        path.join(process.cwd(), 'public', url, 'index.html'),
        path.join(process.cwd(), 'public', url + '.html'),
      ];
      for (const candidate of candidates) {
        if (fs.existsSync(candidate)) {
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.end(fs.readFileSync(candidate, 'utf-8'));
          return;
        }
      }
      next();
    });
  },
};

export default defineConfig({
  plugins: [react(), staticPagesPlugin],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:4001',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    target: 'es2020',
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'framer': ['framer-motion'],
          'icons': ['lucide-react'],
          'dropzone': ['react-dropzone'],
          'i18n-vendor': ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
        },
      },
    },
  },
});
