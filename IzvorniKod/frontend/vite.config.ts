import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


let API_BASE_URL = process.env.API_BASE_URL;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: API_BASE_URL,
        changeOrigin: true,
      },
    },
  },
})