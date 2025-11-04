import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path'; // 1. Import path

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // 2. Add this 'resolve' block
  resolve: {
    alias: {
      // This config must match your tsconfig.json
      "@": path.resolve(__dirname, "./src"), 
    },
  },
});