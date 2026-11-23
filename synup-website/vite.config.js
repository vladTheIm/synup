import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [],
  server: {
    open: true
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        projects: resolve(__dirname, 'projects.html'),
        school: resolve(__dirname, 'school-solution.html'),
        hotel: resolve(__dirname, 'hotel-solution.html'),
        autoparts: resolve(__dirname, 'autoparts-solution.html'),
        church: resolve(__dirname, 'church-solution.html'),
        votsystem: resolve(__dirname, 'votsystem-solution.html')
      }
    }
  }
})
