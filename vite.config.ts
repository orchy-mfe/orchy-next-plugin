/// <reference types="vitest" />
import {visualizer} from 'rollup-plugin-visualizer'
import {defineConfig} from 'vite'

export default defineConfig({
  plugins: [visualizer()],
  build: {
    lib: {
      entry: {
        'orchy-next-plugin': 'src/orchy-next-plugin.ts',
      },
      formats: ['es']
    },
  },
  test: {
    environment: 'happy-dom',
    mockReset: true,
    coverage: {
      enabled: true
    }
  }
})
