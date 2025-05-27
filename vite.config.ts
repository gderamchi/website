import { defineConfig } from 'vite'

export default defineConfig({
  ssr: {
    noExternal: ['motion', 'framer-motion']
  },
  optimizeDeps: {
    include: ['framer-motion', 'lucide-react']
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-motion': ['framer-motion'],
          'vendor-ui': ['lucide-react', '@radix-ui/react-slot']
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
