import tailwindcss from '@tailwindcss/vite'
import basicSsl from '@vitejs/plugin-basic-ssl'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import Sitemap from 'vite-plugin-sitemap'
import { webfontDl } from 'vite-plugin-webfont-dl'
import { AtomFeed } from './plugins/atom-feed'

export default defineConfig({
  server: {
    host: '0.0.0.0'
  },
  plugins: [
    react(),
    tailwindcss(),
    webfontDl(),
    basicSsl(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'SpaceTime Center',
        short_name: 'SpaceTime Center',
        description: 'Welcome To My Home Page ~',
        theme_color: '#ff5a00',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    }),
    Sitemap({
      hostname: 'https://www.spacetimee.xyz'
    }),
    AtomFeed({
      title: 'SpaceTime Center',
      description: 'Welcome To My Home Page ~',
      siteUrl: 'https://www.spacetimee.xyz'
    })
  ],
  resolve: {
    alias: {
      '@': import.meta.dirname
    }
  }
})
