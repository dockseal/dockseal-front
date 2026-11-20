import { expect, test } from '@playwright/test'

import { useMockScenario } from './support/mock-scenario'
import { seedSession } from './support/session'

const WITHOUT_CONTAINER = '/shipments/a0000000-0000-4000-8000-000000000003?tab=containers'
const WITH_CONTAINER = '/shipments/a0000000-0000-4000-8000-000000000001?tab=containers'

test('define o contêiner principal em embarque sem contêiner', async ({ page }) => {
	await seedSession(page, 'OPERADOR')
	await page.goto(WITHOUT_CONTAINER)
	await expect(page.getByText('Nenhum contêiner associado.')).toBeVisible()
	await expect(page.getByRole('radio', { name: 'Adicionar contêiner' })).toHaveCount(0)
	await page.getByLabel('Número do contêiner').fill('abcu 123456-7')
	await page.getByRole('button', { name: 'Associar contêiner' }).click()
	await expect(page.getByText('Contêiner associado.')).toBeVisible()

	const primary = page.getByRole('listitem').filter({ hasText: 'ABCU 123456-7' })

	await expect(primary).toContainText('Principal')
})

test('adiciona um segundo contêiner sem trocar o principal', async ({ page }) => {
	await seedSession(page, 'OPERADOR')
	await page.goto(WITH_CONTAINER)
	await page.getByRole('radio', { name: 'Adicionar contêiner' }).check()
	await page.getByLabel('Número do contêiner').fill('ABCU7654321')
	await page.getByRole('button', { name: 'Associar contêiner' }).click()
	await expect(page.getByText('Contêiner associado.')).toBeVisible()
	await expect(page.getByRole('listitem').filter({ hasText: 'ABCU 765432-1' })).not.toContainText('Principal')
	await expect(page.getByRole('listitem').filter({ hasText: 'MSCU 123456-7' })).toContainText('Principal')
})

test('contêiner em trânsito mostra a mensagem da API', async ({ page }) => {
	await useMockScenario(page, ['container-in-transit'])
	await seedSession(page, 'OPERADOR')
	await page.goto(WITHOUT_CONTAINER)
	await page.getByLabel('Número do contêiner').fill('ABCU1234567')
	await page.getByRole('button', { name: 'Associar contêiner' }).click()
	await expect(page.getByText('Contêiner já está em trânsito em outro embarque')).toBeVisible()
})

test('gestor não vê o formulário de contêiner', async ({ page }) => {
	await seedSession(page, 'GESTOR')
	await page.goto(WITH_CONTAINER)
	await expect(page.getByRole('listitem').filter({ hasText: 'MSCU 123456-7' })).toBeVisible()
	await expect(page.getByLabel('Número do contêiner')).toHaveCount(0)
})
