import { expect, test } from '@playwright/test'

import { seedSession } from './support/session'

test('sem sessão, o botão "Entrar" leva ao login', async ({ page }) => {
	await page.goto('/')
	await page.getByRole('link', { name: 'Entrar' }).click()
	await expect(page).toHaveURL(/\/login$/)
})

test('com sessão de gestor, "Acessar painel" leva ao dashboard', async ({ page }) => {
	await seedSession(page, 'GESTOR')
	await page.goto('/')
	await page.getByRole('link', { name: 'Acessar painel' }).click()
	await expect(page).toHaveURL(/\/dashboard$/)
})
