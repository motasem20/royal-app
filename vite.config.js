// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // يسمح لـ ngrok بالدخول من أي IP
    port: 5173,
    allowedHosts: ['36eb-176-29-168-143.ngrok-free.app'], // يسمح لأي نطاق ngrok
  },
})
