import { defineConfig } from 'astro/config'
import UnoCSS from 'unocss/astro'
import vercel from '@astrojs/vercel/serverless'

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercel({
    nodeVersion: '18'
  }),
  integrations: [
    UnoCSS({
      injectReset: true,
    }),
  ],
  vite: {
    define: {
      'process.env.TURSO_DATABASE_URL': JSON.stringify(process.env.TURSO_DATABASE_URL),
      'process.env.TURSO_AUTH_TOKEN': JSON.stringify(process.env.TURSO_AUTH_TOKEN),
    }
  }
})
