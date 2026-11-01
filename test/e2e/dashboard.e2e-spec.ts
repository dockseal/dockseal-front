import { expect, test } from '@playwright/test'

import { useMockScenario } from './support/mock-scenario'
import { seedSession } from './support/session'

test('mostra os três KPIs com os valores do fixture', async ({ page }) => {
	await seedSession(page, 'GESTOR')
	await page.goto('/dashboard')
	await expect(page.getByRole('heading', { name: 'Visão geral' })).toBeVisible()
	await expect(page.getByRole('region', { name: 'Embarques no pátio' })).toContainText('12')
	await expect(page.getByRole('region', { name: 'Tempo médio em trânsito' })).toContainText('36,5 h')
	await expect(page.getByRole('region', { name: 'Eficiência de validação' })).toContainText('67%')
})

test('métricas nulas mostram "Sem dados"', async ({ page }) => {
	await useMockScenario(page, ['metrics-null'])
	await seedSession(page, 'GESTOR')
	await page.goto('/dashboard')
	await expect(page.getByRole('region', { name: 'Tempo médio em trânsito' })).toContainText('Sem dados')
	await expect(page.getByRole('region', { name: 'Eficiência de validação' })).toContainText('Sem dados')
})

test('gráfico tem 30 barras e rótulo acessível', async ({ page }) => {
	await seedSession(page, 'GESTOR')
	await page.goto('/dashboard')
	await expect(page.getByRole('img', { name: 'Embarques criados nos últimos 30 dias' })).toBeVisible()
	await expect(page.getByTestId('trend-bar')).toHaveCount(30)
})

test('lista 5 embarques recentes com link', async ({ page }) => {
	await seedSession(page, 'GESTOR')
	await page.goto('/dashboard')

	const recent = page.getByRole('region', { name: 'Embarques recentes' })

	await expect(recent.getByRole('link')).toHaveCount(5)
	await recent.getByRole('link', { name: 'SHP-2026-0001' }).click()
	await expect(page).toHaveURL(/\/shipments\/a0000000-0000-4000-8000-000000000001$/)
})

test('alertas abertos levam ao detalhe na central', async ({ page }) => {
	await seedSession(page, 'GESTOR')
	await page.goto('/dashboard')

	const openAlerts = page.getByRole('region', { name: 'Alertas abertos' })

	await expect(openAlerts.getByRole('link')).toHaveCount(3)
	await openAlerts.getByRole('link').first().click()
	await expect(page).toHaveURL(/\/alerts\?alertId=e0000000-0000-4000-8000-000000000003$/)
	await expect(page.getByRole('dialog')).toBeVisible()
})
