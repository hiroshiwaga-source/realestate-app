import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // 常にルート基準の絶対パス（/assets/...）。相対 base だと /login からの再読込で JS が取れない
  base: '/',
  plugins: [react()],
})
