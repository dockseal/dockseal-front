import { expect, type Page } from '@playwright/test'

export type TTestRole = 'OPERADOR' | 'GESTOR' | 'ADMIN'

export const AUTH_STORAGE_KEY = '@dockseal:auth'

export const MOCK_PASSWORD = 'Senha@123'

export const MOCK_EMAIL: Record<TTestRole, string> = {
	OPERADOR: 'operador@dockseal.test',
	GESTOR: 'gestor@dockseal.test',
	ADMIN: 'admin@dockseal.test',
}

export const MOCK_USER_ID: Record<TTestRole, string> = {
	OPERADOR: '11111111-1111-4111-8111-111111111111',
	GESTOR: '22222222-2222-4222-8222-222222222222',
	ADMIN: '33333333-3333-4333-8333-333333333333',
}

export async function loginAs(page: Page, role: TTestRole) {
	await page.goto('/login')
	await page.getByLabel('E-mail').fill(MOCK_EMAIL[role])
	await page.getByLabel('Senha', { exact: true }).fill(MOCK_PASSWORD)
	await page.getByRole('button', { name: 'Entrar', exact: true }).click()
	await expect(page).not.toHaveURL(/\/login$/)
}

export async function seedSession(page: Page, role: TTestRole) {
	const value = JSON.stringify({
		state: { accessToken: `mock-access-${role}`, refreshToken: `mock-refresh-${role}`, role },
		version: 0,
	})

	await page.addInitScript(
		({ key, session }) => {
			if (!window.sessionStorage.getItem('@dockseal:seeded')) {
				window.localStorage.setItem(key, session)
				window.sessionStorage.setItem('@dockseal:seeded', 'true')
			}
		},
		{ key: AUTH_STORAGE_KEY, session: value },
	)
}
