import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      "strict-transport-security": "max-age=86400; includeSubDomains", 
      "referrer-policy": "same-origin", 
      "x-frame-options": "DENY",
      "permissions-policy": "geolocation=(self)", 
    },
  },
})
