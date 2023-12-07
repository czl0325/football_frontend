import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from "unplugin-vue-components/vite";
import { VantResolver } from "@vant/auto-import-resolver"
import ViteCompression from 'vite-plugin-compression'
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [VantResolver()],
    }),
    ViteCompression({
      verbose: true,
      disable: false,
      threshold: 10240,
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  base: './',
  server: {
    host: '0.0.0.0',
    port: 8303,
    open: true,
    proxy: {
      '/api': {
        target: "http://127.0.0.1:5000/",
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks: {
          lodash: ['lodash'],
          vant: ['vant'],
          echarts: ['echarts'],
        }
      }
    }
  }
})
