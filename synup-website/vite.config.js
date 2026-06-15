import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  server: {
    open: true
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        projects: resolve(__dirname, 'projects.html')
      }
    }
  }
})
