import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy all requests starting with `/api` to your backend server
      '/api': {
        target: 'http://127.0.0.1:5000', // Your backend server URL
        changeOrigin: true, // Needed for virtual hosted sites
        rewrite: (path) => path.replace(/^\/api/, ''), // Remove the `/api` prefix when forwarding the request
      },
    },
  },
});
