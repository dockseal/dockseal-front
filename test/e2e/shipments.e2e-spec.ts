import { expect, test } from '@playwright/test'

import { useMockScenario } from './support/mock-scenario'
import { seedSession } from './support/session'

function bodyRows(page: import('@playwright/test').Page) {
	return page.getByRole('table').getByRole('rowgroup').nth(1).getByRole('row')
}

test.describe('lista de embarques', () => {
	test('pagina de 20 em 20', async ({ page }) => {
		await seedSession(page, 'OPERADOR')
		await page.goto('/embarques')
		await expect(bodyRows(page)).toHaveCount(20)
		await expect(page.getByText('Página 1')).toBeVisible()
		await page.getByRole('button', { name: 'Próxima' }).click()
		await expect(page).toHaveURL(/\/embarques\?page=2$/)
		await expect(bodyRows(page)).toHaveCount(5)
		await expect(page.getByRole('button', { name: 'Próxima' })).toBeDisabled()
		await expect(page.getByRole('button', { name: 'Anterior' })).toBeEnabled()
	})

	test('lista vazia mostra o estado vazio e a ação para operador', async ({ page }) => {
		await useMockScenario(page, ['shipments-empty'])
		await seedSession(page, 'OPERADOR')
		await page.goto('/embarques')
		await expect(page.getByText('Nenhum embarque registrado.')).toBeVisible()
		await expect(page.getByRole('link', { name: 'Novo embarque' }).first()).toBeVisible()
	})

	test('erro de rede mostra o erro e permite tentar de novo', async ({ page }) => {
		await useMockScenario(page, ['network-error'])
		await seedSession(page, 'OPERADOR')
		await page.goto('/embarques')
		await expect(page.getByText('Não foi possível conectar à API.', { exact: false })).toBeVisible({ timeout: 15000 })

		const reload = page.waitForRequest((request) => request.url().includes('/shipments?'))

		await page.getByRole('button', { name: 'Tentar novamente' }).click()
		await reload
	})

	test('datas aparecem em pt-BR', async ({ page }) => {
		await seedSession(page, 'OPERADOR')
		await page.goto('/embarques')
		await expect(bodyRows(page).first()).toContainText('20/11/2026')
		await expect(bodyRows(page).first()).toContainText('MSCU 123456-7')
	})
})

test.describe('novo embarque', () => {
	test('criação redireciona ao detalhe', async ({ page }) => {
		await seedSession(page, 'OPERADOR')
		await page.goto('/embarques/novo')
		await page.getByLabel('Origem').fill('Porto de Santos')
		await page.getByLabel('Destino').fill('Roterdã')
		await page.getByLabel('Identificador').fill('SHP-E2E-0001')
		await page.getByRole('button', { name: 'Registrar embarque' }).click()
		await expect(page.getByText('Embarque registrado.')).toBeVisible()
		await expect(page).toHaveURL(/\/embarques\/[0-9a-f-]{36}$/)
		await expect(page.getByRole('heading', { name: 'SHP-E2E-0001' })).toBeVisible()
	})

	test('valida no cliente sem chamar a API', async ({ page }) => {
		let posts = 0

		page.on('request', (request) => {
			if (request.method() === 'POST' && request.url().endsWith('/shipments')) posts++
		})

		await seedSession(page, 'OPERADOR')
		await page.goto('/embarques/novo')
		await page.getByLabel('Número do contêiner').fill('MSC123')
		await page.getByRole('button', { name: 'Registrar embarque' }).click()
		await expect(page.getByText('Informe a origem.')).toBeVisible()
		await expect(page.getByText('Informe o destino.')).toBeVisible()
		await expect(page.getByText('Use o padrão ISO 6346: 4 letras e 7 números.')).toBeVisible()
		expect(posts).toBe(0)
	})

	test('identificador duplicado mostra a mensagem da API', async ({ page }) => {
		await useMockScenario(page, ['shipment-create-duplicate'])
		await seedSession(page, 'OPERADOR')
		await page.goto('/embarques/novo')
		await page.getByLabel('Origem').fill('Porto de Santos')
		await page.getByLabel('Destino').fill('Roterdã')
		await page.getByRole('button', { name: 'Registrar embarque' }).click()
		await expect(page.getByText('Identificador de embarque já cadastrado')).toBeVisible()
		await expect(page).toHaveURL(/\/embarques\/novo$/)
	})

	test('chegada no passado mostra a mensagem da API', async ({ page }) => {
		await useMockScenario(page, ['shipment-create-past-arrival'])
		await seedSession(page, 'OPERADOR')
		await page.goto('/embarques/novo')
		await page.getByLabel('Origem').fill('Porto de Santos')
		await page.getByLabel('Destino').fill('Roterdã')
		await page.getByRole('button', { name: 'Registrar embarque' }).click()
		await expect(page.getByText('Data de chegada prevista não pode ser anterior a hoje')).toBeVisible()
	})
})

test('detalhe inexistente mostra "Embarque não encontrado"', async ({ page }) => {
	await seedSession(page, 'OPERADOR')
	await page.goto('/embarques/ffffffff-ffff-4fff-8fff-ffffffffffff')
	await expect(page.getByText('Embarque não encontrado')).toBeVisible()
	await page.getByRole('link', { name: 'Voltar para embarques' }).click()
	await expect(page).toHaveURL(/\/embarques$/)
})
