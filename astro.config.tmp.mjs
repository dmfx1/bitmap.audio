import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [tailwind(), react()],
  cacheDir: '/tmp/astro-cache',
  vite: { cacheDir: '/tmp/vite-cache' },
});
