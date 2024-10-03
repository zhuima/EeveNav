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
})
