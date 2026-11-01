import { expect, test } from '@playwright/test'

import { seedSession } from './support/session'

test('admin cria, edita e exclui um usuário e a auditoria registra a criação', async ({ page }) => {
	await seedSession(page, 'ADMIN')
	await page.goto('/users')

	const nav = page.getByRole('navigation', { name: 'Navegação principal' })

	await expect(nav.getByRole('link', { name: 'Usuários' })).toBeVisible()
	await page.getByRole('button', { name: 'Novo usuário' }).click()
	await page.getByLabel('Nome').fill('Ana Operadora')
	await page.getByLabel('E-mail').fill('ana@dockseal.test')
	await page.getByRole('combobox').click()
	await page.getByRole('option', { name: 'Operador' }).click()
	await page.getByLabel('Senha', { exact: true }).fill('Senha@123')
	await page.getByRole('button', { name: 'Salvar' }).click()
	await expect(page.getByText('Usuário criado.')).toBeVisible()
	await expect(page.getByRole('cell', { name: 'Ana Operadora' })).toBeVisible()

	await page.getByRole('row', { name: /Ana Operadora/ }).getByRole('button', { name: 'Editar' }).click()
	await page.getByLabel('Nome').fill('Ana Atualizada')
	await page.getByRole('button', { name: 'Salvar' }).click()
	await expect(page.getByText('Usuário atualizado.')).toBeVisible()
	await expect(page.getByRole('cell', { name: 'Ana Atualizada' })).toBeVisible()

	await page.getByRole('row', { name: /Ana Atualizada/ }).getByRole('button', { name: 'Excluir' }).click()
	await page.getByRole('dialog').getByRole('button', { name: 'Excluir' }).click()
	await expect(page.getByText('Usuário excluído.')).toBeVisible()
	await expect(page.getByRole('cell', { name: 'Ana Atualizada' })).toHaveCount(0)

	await nav.getByRole('link', { name: 'Auditoria' }).click()
	await expect(page).toHaveURL(/\/audit$/)
	await expect(page.getByText('Usuário criado')).toBeVisible()
})

test('gestor em /users cai no dashboard', async ({ page }) => {
	await seedSession(page, 'GESTOR')
	await page.goto('/users')
	await expect(page).toHaveURL(/\/dashboard$/)
})

test('operador em /users cai em novo embarque e não vê o menu restrito', async ({ page }) => {
	await seedSession(page, 'OPERADOR')
	await page.goto('/users')
	await expect(page).toHaveURL(/\/shipments\/new$/)

	const nav = page.getByRole('navigation', { name: 'Navegação principal' })

	for (const label of ['Novo embarque', 'Alertas', 'Configurações']) {
		await expect(nav.getByRole('link', { name: label })).toBeVisible()
	}

	for (const label of ['Usuários', 'Dashboard', 'Embarques', 'Análise rápida', 'Auditoria']) {
		await expect(nav.getByRole('link', { name: label })).toHaveCount(0)
	}
})
