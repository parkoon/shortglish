import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    visualizer({
      open: false,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // build: {
  //   rollupOptions: {
  //     output: {
  //       manualChunks: {
  //         'react-vendor': ['react', 'react-dom', 'react-router'],
  //         'query-vendor': ['@tanstack/react-query'],
  //         'ui-vendor': ['framer-motion', 'zustand'],
  //         'markdown-vendor': ['react-markdown', 'remark-gfm'],
  //         'icons-vendor': ['@tabler/icons-react'],
  //         'radix-vendor': [
  //           '@radix-ui/react-alert-dialog',
  //           '@radix-ui/react-slot',
  //           '@radix-ui/react-tooltip',
  //         ],
  //         'utils-vendor': ['sonner', 'vaul', 'react-helmet-async', 'react-error-boundary'],
  //       },
  //     },
  //   },
  // },
})
