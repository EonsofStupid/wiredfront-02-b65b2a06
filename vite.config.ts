import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: true, // Listen on all addresses
    port: 8080,
    watch: {
      usePolling: true,
    },
    hmr: {
      clientPort: 443, // Use 443 for secure WebSocket connections
      host: process.env.VITE_HMR_HOST || undefined,
      protocol: 'wss', // Force WSS protocol
      timeout: 120000, // Increase timeout
      overlay: true
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        ws: true // Enable WebSocket proxy
      }
    }
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  preview: {
    port: 8081,
    strictPort: true,
    host: true,
    hmr: {
      clientPort: 443,
      protocol: 'wss'
    }
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-slot'],
        }
      }
    }
  },
  optimizeDeps: {
    include: ['@radix-ui/react-dialog', '@radix-ui/react-slot']
  }
}));