import { expect, test } from '@playwright/test'

import { useMockScenario } from './support/mock-scenario'
import { seedSession } from './support/session'

const SHIPMENT_ID = 'a0000000-0000-4000-8000-000000000001'

test('gestor vê a linha do tempo em pt-BR', async ({ page }) => {
	await seedSession(page, 'GESTOR')
	await page.goto('/auditoria')
	await expect(page.getByRole('heading', { name: 'Auditoria' })).toBeVisible()

	const timeline = page.getByRole('list', { name: 'Linha do tempo' })

	await expect(timeline.getByRole('listitem')).toHaveCount(8)
	await expect(timeline).toContainText('Alerta resolvido')
	await expect(timeline).toContainText('Validação do embarque')
	await expect(timeline).toContainText('Divergente')
	await expect(timeline.getByRole('listitem').filter({ hasText: 'Falha' })).toContainText('Sistema')
	await expect(timeline.getByRole('listitem').first()).toContainText('Você')
	await expect(timeline.getByRole('listitem').nth(1)).toContainText('Usuário 11111111')
})

test('?shipmentId= filtra os eventos do embarque', async ({ page }) => {
	await seedSession(page, 'GESTOR')
	await page.goto(`/auditoria?shipmentId=${SHIPMENT_ID}`)

	const timeline = page.getByRole('list', { name: 'Linha do tempo' })

	await expect(timeline.getByRole('listitem')).toHaveCount(5)
	await expect(timeline).not.toContainText('Login')
	await page.getByRole('link', { name: 'Limpar filtro' }).click()
	await expect(timeline.getByRole('listitem')).toHaveCount(8)
})

test('lista vazia', async ({ page }) => {
	await useMockScenario(page, ['events-empty'])
	await seedSession(page, 'GESTOR')
	await page.goto('/auditoria')
	await expect(page.getByText('Nenhum registro encontrado.')).toBeVisible()
})

test('aba Histórico do embarque aparece para gestor', async ({ page }) => {
	await seedSession(page, 'GESTOR')
	await page.goto(`/embarques/${SHIPMENT_ID}`)
	await page.getByRole('tab', { name: 'Histórico' }).click()
	await expect(page).toHaveURL(/tab=historico/)
	await expect(page.getByRole('list', { name: 'Linha do tempo' }).getByRole('listitem')).toHaveCount(5)
})

test('aba Histórico some para operador', async ({ page }) => {
	await seedSession(page, 'OPERADOR')
	await page.goto(`/embarques/${SHIPMENT_ID}?tab=historico`)
	await expect(page.getByRole('tab', { name: 'Resumo' })).toHaveAttribute('aria-selected', 'true')
	await expect(page.getByRole('tab', { name: 'Histórico' })).toHaveCount(0)
})
