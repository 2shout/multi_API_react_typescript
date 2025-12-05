import { defineConfig } from "vite";

export default defineConfig({
  base: "/multi_API/",
  build: {
    rollupOptions: {
      input: {
        main: "./index.html",
        crypto: "./pages/crypto.html",
        books: "./pages/books.html",
        currency: "./pages/currency.html",
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
