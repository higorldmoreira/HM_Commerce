import { defineConfig } from 'vite'
import { config } from 'dotenv'
import react from '@vitejs/plugin-react'

config()

export default defineConfig({
  plugins: [react()],
  base: './', // Usar caminhos relativos para compatibilidade com IIS
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
    __DEV__: process.env.NODE_ENV !== 'production'
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  esbuild: {
    // Remover console.log em produção
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : []
  },
  server: {
    port: 5173,
    cors: true,
    proxy: {
      // Proxy para a API em desenvolvimento para evitar CORS
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    coverage: {
      reporter: ['text', 'lcov'],
      include: ['src/**/*.{js,jsx}'],
      exclude: ['src/main.jsx']
    }
  },
  build: {
    rollupOptions: {
      external: [],
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'mui': ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
          'router': ['react-router-dom'],
          'utils': ['date-fns', 'xlsx', 'axios']
        },
        // Configurações para produção mais estável
        format: 'es',
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      },
      // Configurações para lidar com dependências problemáticas
      onwarn(warning, warn) {
        if (warning.code === 'THIS_IS_UNDEFINED') return
        warn(warning)
      }
    },
    copyPublicDir: true,
    chunkSizeWarningLimit: 1024,
    sourcemap: false, // Desabilitar sourcemaps em produção
    minify: 'esbuild', // Usar esbuild em vez de terser
    target: ['es2015', 'chrome58', 'firefox57', 'safari11'], // Melhor compatibilidade
    cssCodeSplit: true,
    reportCompressedSize: false // Acelerar build
  },
  publicDir: 'public'
})
