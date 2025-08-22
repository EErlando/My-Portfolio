import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/My-Portfolio/', // MUST match your repo name (case‑sensitive) and include leading/trailing slashes
  plugins: [react()],
})