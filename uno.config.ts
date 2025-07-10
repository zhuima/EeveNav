import { defineConfig, presetAttributify, presetUno } from 'unocss'

export default defineConfig({
  presets: [
    presetAttributify({
      /* preset options */
    }),
    presetUno({

    }),
  ],
  shortcuts: [
    {
      container: 'w-full mx-auto px-8 lg:max-w-[1250px]',
    },
  ],
  theme: {
    colors: {
      'background': '#fff',
      'foreground': 'hsl(240deg 10% 3.9% / 80%)',
      'muted-foreground': 'hsl(240 3.8% 46.1%)',
      'ring': 'hsl(240 5.9% 10%)',
      'primary': '#dc2626',
    },
  },
  // 添加暗色模式支持
  darkMode: 'class',
  // 添加暗色模式相关的规则
  rules: [
    // 暗色模式背景
    ['dark-bg-primary', { 'background-color': '#0f172a' }],
    ['dark-bg-secondary', { 'background-color': '#1e293b' }],
    ['dark-bg-muted', { 'background-color': '#334155' }],
    // 暗色模式文字
    ['dark-text-primary', { 'color': '#f8fafc' }],
    ['dark-text-secondary', { 'color': '#cbd5e1' }],
    ['dark-text-muted', { 'color': '#94a3b8' }],
    // 暗色模式边框
    ['dark-border', { 'border-color': '#334155' }],
  ],
  // 添加暗色模式变体
  variants: [
    (matcher) => {
      if (!matcher.startsWith('dark:')) return matcher
      return {
        matcher: matcher.slice(5),
        selector: s => `.dark ${s}`,
      }
    }
  ]
})
