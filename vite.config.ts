import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools(),
    // The PDF renderer's serverless Chromium (src/lib/pdf/render.ts) ships its browser as binary
    // files next to its code. Without a full trace Nitro bundles only the JavaScript, the binary is
    // missing from the deployment, and every PDF on Vercel fails. 'pkg*' copies the whole package.
    nitro({ traceDeps: ['@sparticuz/chromium*'] }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
})

export default config
