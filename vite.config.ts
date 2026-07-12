import tailwindcss from '@tailwindcss/vite'
import basicSsl from '@vitejs/plugin-basic-ssl'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import Sitemap from 'vite-plugin-sitemap'
import { webfontDl } from 'vite-plugin-webfont-dl'
import { description, name, themeColor, url } from './consts/site'
import { AtomFeed } from './plugins/atomFeed'

export default defineConfig({
  server: { host: '0.0.0.0' },
  plugins: [
    react(),
    tailwindcss(),
    webfontDl(undefined, { subsetsAllowed: ['latin', 'chinese-simplified'] }),
    basicSsl(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name,
        short_name: name,
        description,
        theme_color: themeColor,
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
    Sitemap({ hostname: url }),
    AtomFeed({
      title: name,
      description,
      url
    })
  ],
  resolve: { alias: { '@': import.meta.dirname } }
})
