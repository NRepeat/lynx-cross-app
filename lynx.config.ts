import { defineConfig } from '@lynx-js/rspeedy'
import { pluginQRCode } from '@lynx-js/qrcode-rsbuild-plugin'
import { pluginReactLynx } from '@lynx-js/react-rsbuild-plugin'
import { pluginTailwindCSS } from 'rsbuild-plugin-tailwindcss'
export default defineConfig({
  plugins: [
    pluginTailwindCSS({
      config: './tailwind.config.js',
      include: './src/**/*.{html,js,jsx,ts,tsx}',
      exclude: './src/**/*.{test,spec}.{js,jsx,ts,tsx}',
    }),
    pluginQRCode({
      schema(url) {
        // We use `?fullscreen=true` to open the page in LynxExplorer in full screen mode
        return `${url}?fullscreen=true`
      },
    }),
    pluginReactLynx(),
  ],
})
