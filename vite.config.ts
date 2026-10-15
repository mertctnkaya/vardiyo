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
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@react-pdf')) {
              return 'vendor-pdf';
            }
            if (id.includes('html2canvas')) {
              return 'vendor-html2canvas';
            }
            if (id.includes('recharts') || id.includes('d3-')) {
              return 'vendor-charts';
            }
            if (id.includes('@supabase')) {
              return 'vendor-supabase';
            }
            if (id.includes('@capacitor') || id.includes('@capawesome') || id.includes('@revenuecat')) {
              return 'vendor-capacitor';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom') || id.includes('zustand')) {
              return 'vendor-framework';
            }
          }
        }
      }
    }
  }
})