import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "./src/assets/base.scss" as *;`,
      },
    },
  },
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['fairy-icon.png', 'fairy-icon192x192.png', 'fairy-icon512x512.png', 'fairy-icon-180x180.png'],
      manifest: {
        name: 'fairyVault',
        short_name: 'fairyVault',
        description: "fairy's vault",
        theme_color: '#7F6D88',
        icons: [
          {
            src: 'fairy-icon192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'fairy-icon512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'fairy-icon512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'fairy-icon512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
