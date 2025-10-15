import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as fs from 'fs';
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // small build plugin to copy resume.pdf into dist/assets so
    // the app's iframe at `/assets/resume.pdf` works after `vite build`
    {
      name: 'copy-resume',
      // writeBundle runs after files are written to disk
      writeBundle() {
        try {
          const src = path.resolve(__dirname, 'resume.pdf');
          if (!fs.existsSync(src)) return;
          const destDir = path.resolve(__dirname, 'dist', 'assets');
          fs.mkdirSync(destDir, { recursive: true });
          const dest = path.join(destDir, 'resume.pdf');
          fs.copyFileSync(src, dest);
          // eslint-disable-next-line no-console
          console.log('[copy-resume] copied resume.pdf to', dest);
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error('[copy-resume] failed to copy resume.pdf', e);
        }
      }
    }
  ],
  server: {
    port: 3000
  }
});
