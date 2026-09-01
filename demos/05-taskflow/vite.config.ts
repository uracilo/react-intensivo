import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const base = process.env.VERCEL ? '/' : '/react-intensivo/05/'

export default defineConfig({
  plugins: [react()],
  base,
  server: {
    proxy: {
      '/api': {
        target: 'http://52.87.135.237:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
