import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  ssr: {
    noExternal: ['motion', 'lottie-react', 'framer-motion']
  },
  optimizeDeps: {
    include: ['lottie-react', 'framer-motion', 'lucide-react']
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-motion': ['framer-motion'],
          'vendor-ui': ['lucide-react', '@radix-ui/react-slot'],
          'vendor-lottie': ['lottie-react']
        }
      }
    },
    cssCodeSplit: true,
    minify: 'esbuild',
    target: 'es2020'
  },
  server: {
    fs: {
      allow: ['..']
    }
  }
})
