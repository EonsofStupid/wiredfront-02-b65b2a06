import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    watch: {
      usePolling: true,
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/supabase': {
        target: 'http://localhost:54321',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/supabase/, '')
      },
      '/redis': {
        target: 'http://localhost:6379',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/redis/, '')
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
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-slot'],
          'utils': ['@/lib/utils', '@/lib/api'],
          'stores': ['@/stores'],
        }
      }
    },
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: true,
    cssCodeSplit: true,
  },
  optimizeDeps: {
    include: [
      '@radix-ui/react-dialog',
      '@radix-ui/react-slot',
      'react',
      'react-dom',
      'zustand'
    ]
  }
}));