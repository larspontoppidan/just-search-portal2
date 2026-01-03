import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { readFileSync } from 'fs'

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'))

const inlineFavicon = {
  name: 'inline-favicon',
  transformIndexHtml(html) {
    const faviconPath = './src/assets/favicon.png'
    const base64 = readFileSync(faviconPath).toString('base64')
    return html.replace(
      '{favicon}',
      `<link rel="icon" type="image/png" href="data:image/png;base64,${base64}" />`
    )
  }
}

export default defineConfig({
  plugins: [react(), inlineFavicon, viteSingleFile()],
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
    __APP_GITHUB_URL__: JSON.stringify(pkg.repository.url),
  },
  build: {
    cssCodeSplit: false,
    assetsInlineLimit: 100000000,
  },
})

