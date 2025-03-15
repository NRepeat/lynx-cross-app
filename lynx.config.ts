import { defineConfig } from '@lynx-js/rspeedy';
import { pluginQRCode } from '@lynx-js/qrcode-rsbuild-plugin';
import { pluginReactLynx } from '@lynx-js/react-rsbuild-plugin';
import { pluginTailwindCSS } from 'rsbuild-plugin-tailwindcss';
export default defineConfig({
  dev: {
    assetPrefix: 'http://192.168.0.100:3000/assets/',
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  plugins: [
    pluginTailwindCSS({
      config: './tailwind.config.js',
      include: './src/**/*.{html,js,jsx,ts,tsx}',
      exclude: './src/**/*.{test,spec}.{js,jsx,ts,tsx}',
    }),
    pluginQRCode({
      schema(url) {
        return `${url}?fullscreen=true`;
      },
    }),
    pluginReactLynx(),
  ],
});
