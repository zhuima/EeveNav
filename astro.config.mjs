import { defineConfig } from 'astro/config'
import UnoCSS from 'unocss/astro'
import node from '@astrojs/node'

// https://astro.build/config
export default defineConfig({
  output: 'hybrid', // 混合模式：静态页面 + 服务端页面
  adapter: node({ mode: 'standalone' }), // 使用Node.js适配器支持混合模式
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
