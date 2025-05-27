// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
  ],
  site: 'https://guillaume18100.github.io',
  base: '/website',
  output: 'static',
  build: {
    assets: 'assets'
  },
  vite: {
    resolve: {
      alias: {
        '@': new URL('./src', import.meta.url).pathname
      }
    },
    optimizeDeps: {
      include: ['lottie-react', 'framer-motion']
    }
  }
});
