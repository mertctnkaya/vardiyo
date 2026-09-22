import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      workbox: {
        maximumFileSizeToCacheInBytes: 5000000 // 5 MB to allow pdf generator chunk
      },
      manifest: {
        name: 'vardiyo',
        short_name: 'vardiyo',
        description: 'Akıllı Vardiya ve Bordro Takip Sistemi & CV Oluşturucu',
        theme_color: '#4f46e5', // indigo-600
        icons: [
          {
            src: '/vardiyo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})