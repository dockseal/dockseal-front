import type { Page } from '@playwright/test'

export const MOCK_SCENARIO_STORAGE_KEY = '@dockseal:mock-scenario'

export async function useMockScenario(page: Page, scenarios: string[]) {
	await page.addInitScript(
		({ key, value }) => {
			window.localStorage.setItem(key, value)
		},
		{ key: MOCK_SCENARIO_STORAGE_KEY, value: JSON.stringify(scenarios) },
	)
}
