import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  root: './', // Memastikan Vite mencari index.html di folder frontend
  server: {
    port: 5050,
    strictPort: true,
    host: true,
    open: true
  },
  build: {
    outDir: 'dist'
  }
})