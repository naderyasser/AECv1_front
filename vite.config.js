import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: [],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'chakra-vendor': ['@chakra-ui/react', '@chakra-ui/icons'],
          'icons-vendor': ['react-icons'],
          'utils-vendor': ['axios', 'date-fns', 'uuid']
        }
      }
    }
  }
});
