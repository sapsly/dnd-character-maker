import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    port: 5173,
    open: false
  },
  preview: {
    port: 4173,
    // A `cloudflared` quick tunnel proxies the request through Cloudflare's
    // edge, so the Host header is a randomly generated *.trycloudflare.com
    // subdomain that changes on every restart. Vite blocks unknown Host values
    // by default (DNS-rebinding guard), so allow that wildcard explicitly
    // rather than disabling the check entirely.
    allowedHosts: ['.trycloudflare.com']
  }
})