import { expect, type Page, test } from '@playwright/test'

import { useMockScenario } from './support/mock-scenario'
import { seedSession } from './support/session'

const CRITICAL_ALERT_ID = 'e0000000-0000-4000-8000-000000000003'
const RESOLVED_ALERT_ID = 'e0000000-0000-4000-8000-000000000001'

function bodyRows(page: Page) {
	return page.getByRole('table').getByRole('rowgroup').nth(1).getByRole('row')
}

async function selectFilter(page: Page, name: string, option: string) {
	await page.getByRole('combobox', { name }).click()
	await page.getByRole('option', { name: option, exact: true }).click()
}

test('ordena por severidade', async ({ page }) => {
	await seedSession(page, 'GESTOR')
	await page.goto('/alerts')
	await expect(page.getByRole('heading', { name: 'Central de alertas' })).toBeVisible()
	await expect(bodyRows(page)).toHaveCount(4)
	await expect(bodyRows(page).nth(0)).toContainText('Crítica')
	await expect(bodyRows(page).nth(1)).toContainText('Alta')
	await expect(bodyRows(page).nth(2)).toContainText('Média')
	await expect(bodyRows(page).nth(3)).toContainText('Baixa')
})

test('filtros gravam na URL e vão na requisição', async ({ page }) => {
	await seedSession(page, 'GESTOR')
	await page.goto('/alerts')
	await expect(bodyRows(page)).toHaveCount(4)
	await selectFilter(page, 'Status', 'Aberto')

	const request = page.waitForRequest(
		(candidate) => candidate.url().includes('/alerts?') && candidate.url().includes('severity=CRITICA'),
	)

	await selectFilter(page, 'Severidade', 'Crítica')

	const url = new URL((await request).url())

	expect(url.searchParams.get('status')).toBe('OPEN')
	expect(url.searchParams.get('severity')).toBe('CRITICA')

	const pageUrl = new URL(page.url())

	expect(pageUrl.searchParams.get('status')).toBe('OPEN')
	expect(pageUrl.searchParams.get('severity')).toBe('CRITICA')
	await expect(bodyRows(page)).toHaveCount(1)
})

test('lista vazia', async ({ page }) => {
	await useMockScenario(page, ['alerts-empty'])
	await seedSession(page, 'GESTOR')
	await page.goto('/alerts')
	await expect(page.getByText('Nenhum alerta encontrado.')).toBeVisible()
})

test('detalhes abrem o painel com a divergência completa', async ({ page }) => {
	await seedSession(page, 'GESTOR')
	await page.goto('/alerts')
	await bodyRows(page).nth(0).getByRole('button', { name: 'Detalhes' }).click()
	await expect(page).toHaveURL(new RegExp(`alertId=${CRITICAL_ALERT_ID}`))

	const sheet = page.getByRole('dialog')

	await expect(sheet.getByRole('heading', { name: 'número do contêiner' })).toBeVisible()
	await expect(sheet.getByText('Corrigir o número do contêiner na Nota Fiscal para MSCU1234567.').first()).toBeVisible()
	await expect(sheet.getByRole('row').filter({ hasText: 'MSCU7654321' })).toContainText('nota_fiscal.docx')
})

test('gestor resolve com nota', async ({ page }) => {
	await seedSession(page, 'GESTOR')
	await page.goto(`/alerts?alertId=${CRITICAL_ALERT_ID}`)

	const sheet = page.getByRole('dialog')

	await sheet.getByLabel('Nota de resolução').fill('Corrigido na Nota Fiscal.')
	await sheet.getByRole('button', { name: 'Marcar como resolvido' }).click()
	await expect(page.getByText('Alerta atualizado.')).toBeVisible()
	await expect(sheet.getByText('Resolvido', { exact: true })).toBeVisible()
	await expect(sheet.getByText('Corrigido na Nota Fiscal.')).toBeVisible()
	await expect(sheet.getByRole('button', { name: 'Reabrir' })).toBeVisible()
})

test('"Reabrir" só aparece em alerta não aberto', async ({ page }) => {
	await seedSession(page, 'GESTOR')
	await page.goto(`/alerts?alertId=${RESOLVED_ALERT_ID}`)

	const sheet = page.getByRole('dialog')

	await expect(sheet.getByRole('button', { name: 'Reabrir' })).toBeVisible()
	await expect(sheet.getByRole('button', { name: 'Marcar como resolvido' })).toHaveCount(0)
	await page.goto(`/alerts?alertId=${CRITICAL_ALERT_ID}`)
	await expect(page.getByRole('dialog').getByRole('button', { name: 'Marcar como resolvido' })).toBeVisible()
	await expect(page.getByRole('dialog').getByRole('button', { name: 'Reabrir' })).toHaveCount(0)
})

test('operador não vê ações', async ({ page }) => {
	await seedSession(page, 'OPERADOR')
	await page.goto(`/alerts?alertId=${CRITICAL_ALERT_ID}`)

	const sheet = page.getByRole('dialog')

	await expect(sheet.getByRole('heading', { name: 'número do contêiner' })).toBeVisible()
	await expect(sheet.getByRole('button', { name: 'Marcar como resolvido' })).toHaveCount(0)
	await expect(sheet.getByLabel('Nota de resolução')).toHaveCount(0)
})

test('alerta inexistente no PATCH mostra a mensagem da API', async ({ page }) => {
	await useMockScenario(page, ['alert-patch-404'])
	await seedSession(page, 'GESTOR')
	await page.goto(`/alerts?alertId=${CRITICAL_ALERT_ID}`)
	await page.getByRole('dialog').getByRole('button', { name: 'Fechar', exact: true }).click()
	await expect(page.getByText('Alerta não encontrado')).toBeVisible()
})

test('Esc fecha o painel e remove alertId', async ({ page }) => {
	await seedSession(page, 'GESTOR')
	await page.goto(`/alerts?alertId=${CRITICAL_ALERT_ID}`)
	await expect(page.getByRole('dialog')).toBeVisible()
	await page.keyboard.press('Escape')
	await expect(page.getByRole('dialog')).toHaveCount(0)
	await expect(page).not.toHaveURL(/alertId=/)
})
