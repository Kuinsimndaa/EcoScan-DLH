import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  root: './',
  publicDir: 'public',
  server: {
    port: 5050,
    strictPort: false,
    host: '0.0.0.0',
    open: false,
    hmr: {
      host: 'localhost',
      port: 5050,
      protocol: 'ws'
    },
    headers: {
      'Cache-Control': 'no-cache',
      'Service-Worker-Allowed': '/'
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    copyPublicDir: true
  }
})