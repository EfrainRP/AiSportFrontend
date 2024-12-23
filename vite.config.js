import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_PROXY_SERVER, // Usar la variable de entorno
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // Opcional: elimina '/api' del path
      },
    },
  },
})
