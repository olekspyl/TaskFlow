import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'
import vueDevTools from 'vite-plugin-vue-devtools'
import Components from 'unplugin-vue-components/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
// https://vite.dev/config/
export default defineConfig({
  base: '/TaskFlow/',

  plugins: [
    vue(),
    Icons({ autoInstall: true }),
    Components({
      resolvers: [
        IconsResolver({
          prefix: 'Icon',
        }),
      ],
    }),
    vueDevTools(),
  ],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
