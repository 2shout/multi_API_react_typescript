import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: "/multi_API/",
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        crypto: './src/pages/crypto.html',
        books: './src/pages/books.html',
        currency: './src/pages/currency.html',
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
