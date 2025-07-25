import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: [
      'localhost',
      '.preview.emergentagent.com',
      'ca8ae87d-876e-4374-b5e8-5919fe60013e.preview.emergentagent.com'
    ]
  },
  define: {
    'process.env': {}
  }
})