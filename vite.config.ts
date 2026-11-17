import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// The homepage, programme, quiz and free pages are built by Vite. Every other page lives in
// public/ and is copied to the site unchanged, alongside CNAME.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  appType: 'mpa',
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    rollupOptions: {
      input: {
        home: fileURLToPath(new URL('./index.html', import.meta.url)),
        programme: fileURLToPath(new URL('./12-week-programme/index.html', import.meta.url)),
        quiz: fileURLToPath(new URL('./quiz/index.html', import.meta.url)),
        free: fileURLToPath(new URL('./free/index.html', import.meta.url)),
      },
    },
  },
})
