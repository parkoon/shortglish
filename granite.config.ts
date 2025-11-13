import { defineConfig } from '@apps-in-toss/web-framework/config'

export default defineConfig({
  appName: 'shortglish',
  brand: {
    displayName: '숏글리시', // 화면에 노출될 앱의 한글 이름으로 바꿔주세요.
    primaryColor: '#3182f6', // 화면에 노출될 앱의 기본 색상으로 바꿔주세요.
    icon: 'https://atkufyuiprxolawrbwta.supabase.co/storage/v1/object/sign/product-images/logoshort.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jYWUwMDA0MS1hZDFmLTQ4YWItOWNjOC0wYzY3ZjQ0MTRkZDQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwcm9kdWN0LWltYWdlcy9sb2dvc2hvcnQucG5nIiwiaWF0IjoxNzYxODc3NjUyLCJleHAiOjE4NTY0ODU2NTJ9.IqhqErMBP-ay17cvDEJXPCGNv6tVyMKoFI3ftRSI0XM', // 화면에 노출될 앱의 아이콘 이미지 주소로 바꿔주세요.
    bridgeColorMode: 'basic',
  },
  web: {
    // host: '192.168.102.150',
    host: 'localhost',
    port: 5173,
    commands: {
      // dev: 'vite --host',
      dev: 'vite',
      build: 'tsc -b && vite build',
    },
  },
  permissions: [],
  outdir: 'dist',
  webViewProps: {
    allowsInlineMediaPlayback: true,
  },
})
