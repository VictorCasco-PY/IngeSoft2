import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      "Strict-Transport-Security": "max-age=86400; includeSubDomains", 
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "X-XSS-Protection": "1; mode=block", 
      'Content-Security-Policy': 'upgrade-insecure-requests',
    },
  },
})
