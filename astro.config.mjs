import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    mode: 'directory',
    runtime: {
      mode: 'local',
      type: 'workers',
    },
    platformProxy: {
      enabled: true
    }
  }),
  vite: {
    resolve: {
      alias: {
        '~': '.'
      }
    }
  }
});
