import { expect, test } from '@playwright/test'

import { useMockScenario } from './support/mock-scenario'
import { seedSession } from './support/session'

const VALIDATED_SHIPMENT = '/shipments/a0000000-0000-4000-8000-000000000002?tab=validation'
const EMPTY_SHIPMENT = '/shipments/a0000000-0000-4000-8000-000000000003?tab=validation'
const VALIDATIONS_SHIPMENT = '/shipments/a0000000-0000-4000-8000-000000000001?tab=validation'

test('validação lenta mostra pendência e depois o resultado divergente', async ({ page }) => {
	await useMockScenario(page, ['validate-slow'])
	await seedSession(page, 'GESTOR')
	await page.goto(VALIDATED_SHIPMENT)
	await expect(page.getByText('Validado', { exact: true })).toBeVisible()

	const button = page.getByRole('button', { name: 'Validar com IA' })

	await button.click()
	await expect(page.getByRole('status').filter({ hasText: 'Analisando documentos com IA.' })).toBeVisible()
	await expect(button).toBeDisabled()
	await expect(page.getByText('Divergente', { exact: true })).toBeVisible({ timeout: 10000 })

	const divergences = page.getByRole('article')

	await expect(divergences).toHaveCount(3)
	await expect(divergences.nth(0)).toContainText('Crítica')
	await expect(divergences.nth(1)).toContainText('Alta')
	await expect(divergences.nth(2)).toContainText('Média')
	await expect(page.getByText('Pendente de revisão', { exact: true })).toBeVisible()
	await expect(page.getByText('Validação concluída: Divergente.')).toBeVisible()
})

test('embarque sem documentos mostra o detail 422', async ({ page }) => {
	await seedSession(page, 'GESTOR')
	await page.goto(EMPTY_SHIPMENT)
	await expect(page.getByText('Nenhuma validação realizada.')).toBeVisible()
	await page.getByRole('button', { name: 'Validar com IA' }).click()
	await expect(page.getByText('O embarque não possui documentos com texto extraído para analisar.')).toBeVisible()
})

test('falha da IA mostra a mensagem de 502', async ({ page }) => {
	await useMockScenario(page, ['validate-502'])
	await seedSession(page, 'GESTOR')
	await page.goto(VALIDATED_SHIPMENT)
	await page.getByRole('button', { name: 'Validar com IA' }).click()
	await expect(page.getByText('Não foi possível analisar agora. Tente novamente em instantes.')).toBeVisible()
})

test('lista validações anteriores', async ({ page }) => {
	await seedSession(page, 'OPERADOR')
	await page.goto(VALIDATIONS_SHIPMENT)
	await expect(page.getByText('Divergente', { exact: true }).first()).toBeVisible()

	const history = page.getByRole('region', { name: 'Validações anteriores' })

	await expect(history.getByRole('listitem')).toHaveCount(1)
	await expect(history).toContainText('Conforme')
})
