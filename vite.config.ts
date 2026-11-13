import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  // GitHub Pages serves this repository below /222-cafe/; local/Sites builds use /.
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [react()],
});
