import { expect, test } from '@playwright/test'

import { useMockScenario } from './support/mock-scenario'
import { seedSession } from './support/session'

test('API fora do ar ao carregar a sessão mostra erro em pt-BR', async ({ page }) => {
	await useMockScenario(page, ['me-network-error'])
	await seedSession(page, 'OPERADOR')
	await page.goto('/embarques')
	await expect(page.getByText('Não foi possível conectar à API', { exact: false })).toBeVisible()
	await expect(page.getByRole('button', { name: 'Tentar novamente' })).toBeVisible()
	await expect(page.getByText('Something went wrong')).toHaveCount(0)
})

test('operador vê o menu sem Auditoria', async ({ page }) => {
	await seedSession(page, 'OPERADOR')
	await page.goto('/embarques')

	const nav = page.getByRole('navigation', { name: 'Navegação principal' })

	for (const label of ['Dashboard', 'Embarques', 'Análise rápida', 'Alertas', 'Configurações']) {
		await expect(nav.getByRole('link', { name: label })).toBeVisible()
	}

	await expect(nav.getByRole('link', { name: 'Auditoria' })).toHaveCount(0)
})

test('gestor vê todo o menu, sem a ação "Novo embarque"', async ({ page }) => {
	await seedSession(page, 'GESTOR')
	await page.goto('/embarques')

	const nav = page.getByRole('navigation', { name: 'Navegação principal' })

	for (const label of ['Dashboard', 'Embarques', 'Análise rápida', 'Alertas', 'Auditoria', 'Configurações']) {
		await expect(nav.getByRole('link', { name: label })).toBeVisible()
	}

	await expect(page.getByRole('heading', { name: 'Embarques' })).toBeVisible()
	await expect(page.getByRole('link', { name: 'Novo embarque' })).toHaveCount(0)
})

test('operador em /auditoria é redirecionado para /embarques', async ({ page }) => {
	await seedSession(page, 'OPERADOR')
	await page.goto('/auditoria')
	await expect(page).toHaveURL(/\/embarques$/)
})

test('gestor em /embarques/novo é redirecionado para /dashboard', async ({ page }) => {
	await seedSession(page, 'GESTOR')
	await page.goto('/embarques/novo')
	await expect(page).toHaveURL(/\/dashboard$/)
})

test.describe('mobile', () => {
	test.use({ viewport: { width: 390, height: 844 } })

	test('menu abre em painel lateral e navega', async ({ page }) => {
		await seedSession(page, 'GESTOR')
		await page.goto('/dashboard')
		await page.getByRole('button', { name: 'Abrir menu' }).click()

		const dialog = page.getByRole('dialog')

		await dialog.getByRole('link', { name: 'Alertas' }).click()
		await expect(page).toHaveURL(/\/alertas$/)
		await expect(page.getByRole('dialog')).toHaveCount(0)
	})

	test('login esconde a coluna da marca', async ({ page }) => {
		await page.goto('/login')
		await expect(page.getByText('dockseal', { exact: true })).toBeHidden()
		await expect(page.getByRole('button', { name: 'Entrar', exact: true })).toBeVisible()
	})
})
