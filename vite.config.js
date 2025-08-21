import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // MUST match your repo name (case‑sensitive) and include leading/trailing slashes
  base: '/My-Portfolio/',
})