import { fileURLToPath } from 'node:url'
import { defineConfig, mergeConfig } from 'vitest/config'

import viteConfig from './vite.config.ts'

export default mergeConfig(
	viteConfig,
	defineConfig({
		mode: 'test',
		resolve: {
			alias: {
				'@': fileURLToPath(new URL('./src', import.meta.url)),
			},
		},
		test: {
			environment: 'happy-dom',
			include: ['test/unit/**/*.spec.ts'],
			setupFiles: ['test/unit/setup.ts'],
		},
	}),
)
