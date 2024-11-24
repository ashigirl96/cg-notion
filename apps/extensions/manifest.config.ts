import { defineManifest } from '@crxjs/vite-plugin'
import { description, version } from './package.json'

export default defineManifest(async (_env) => ({
  name: 'cg-extension',
  manifest_version: 3,
  version,
  description,
  content_scripts: [
    {
      matches: ['https://chatgpt.com/*'],
      js: ['scripts/hello.ts'],
    },
  ],
  background: {
    service_worker: 'background/index.ts',
  },
  omnibox: {
    keyword: 'cg',
  },
  icons: {
    '16': 'assets/icons/16x16.png',
    '32': 'assets/icons/32x32.png',
    '48': 'assets/icons/32x32.png',
    '128': 'assets/icons/128x128.png',
  },
}))
