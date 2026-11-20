import { expect, test } from '@playwright/test'

import { useMockScenario } from './support/mock-scenario'
import { seedSession } from './support/session'

test('API fora do ar ao carregar a sessão mostra erro em pt-BR', async ({ page }) => {
	await useMockScenario(page, ['me-network-error'])
	await seedSession(page, 'OPERADOR')
	await page.goto('/shipments/new')
	await expect(page.getByText('Não foi possível conectar à API', { exact: false })).toBeVisible()
	await expect(page.getByRole('button', { name: 'Tentar novamente' })).toBeVisible()
	await expect(page.getByText('Something went wrong')).toHaveCount(0)
})

test('operador vê só novo embarque, alertas e configurações', async ({ page }) => {
	await seedSession(page, 'OPERADOR')
	await page.goto('/shipments/new')

	const nav = page.getByRole('navigation', { name: 'Navegação principal' })

	for (const label of ['Novo embarque', 'Alertas', 'Configurações']) {
		await expect(nav.getByRole('link', { name: label })).toBeVisible()
	}

	for (const label of ['Dashboard', 'Embarques', 'Análise rápida', 'Auditoria', 'Usuários']) {
		await expect(nav.getByRole('link', { name: label })).toHaveCount(0)
	}
})

test('gestor vê todo o menu, sem a ação "Novo embarque"', async ({ page }) => {
	await seedSession(page, 'GESTOR')
	await page.goto('/shipments')

	const nav = page.getByRole('navigation', { name: 'Navegação principal' })

	for (const label of ['Dashboard', 'Embarques', 'Análise rápida', 'Alertas', 'Auditoria', 'Configurações']) {
		await expect(nav.getByRole('link', { name: label })).toBeVisible()
	}

	await expect(page.getByRole('heading', { name: 'Embarques' })).toBeVisible()
	await expect(page.getByRole('link', { name: 'Novo embarque' })).toHaveCount(0)
	await expect(nav.getByRole('link', { name: 'Usuários' })).toHaveCount(0)
})

test('operador em /audit é redirecionado para /shipments/new', async ({ page }) => {
	await seedSession(page, 'OPERADOR')
	await page.goto('/audit')
	await expect(page).toHaveURL(/\/shipments\/new$/)
})

test('gestor em /shipments/new é redirecionado para /dashboard', async ({ page }) => {
	await seedSession(page, 'GESTOR')
	await page.goto('/shipments/new')
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
		await expect(page).toHaveURL(/\/alerts$/)
		await expect(page.getByRole('dialog')).toHaveCount(0)
	})

	test('login esconde a coluna da marca', async ({ page }) => {
		await page.goto('/login')
		await expect(page.getByText('dockseal', { exact: true })).toBeHidden()
		await expect(page.getByRole('button', { name: 'Entrar', exact: true })).toBeVisible()
	})
})
