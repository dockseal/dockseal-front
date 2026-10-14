import { expect, test } from '@playwright/test'

import { useMockScenario } from './support/mock-scenario'
import { AUTH_STORAGE_KEY, loginAs, MOCK_EMAIL, seedSession } from './support/session'

test.describe('login', () => {
	test('operador vai para /embarques', async ({ page }) => {
		await loginAs(page, 'OPERADOR')
		await expect(page).toHaveURL(/\/embarques$/)
	})

	test('gestor vai para /dashboard', async ({ page }) => {
		await loginAs(page, 'GESTOR')
		await expect(page).toHaveURL(/\/dashboard$/)
	})

	test('admin vai para /dashboard', async ({ page }) => {
		await loginAs(page, 'ADMIN')
		await expect(page).toHaveURL(/\/dashboard$/)
	})

	test('credencial errada mostra o erro e continua no login', async ({ page }) => {
		await page.goto('/login')
		await page.getByLabel('E-mail').fill(MOCK_EMAIL.GESTOR)
		await page.getByLabel('Senha', { exact: true }).fill('senha-errada')
		await page.getByRole('button', { name: 'Entrar', exact: true }).click()
		await expect(page.getByText('E-mail ou senha inválidos')).toBeVisible()
		await expect(page).toHaveURL(/\/login$/)
	})

	test('campos vazios mostram validação e não fazem POST', async ({ page }) => {
		let loginRequests = 0

		page.on('request', (request) => {
			if (request.url().endsWith('/auth/login')) loginRequests++
		})

		await page.goto('/login')
		await page.getByRole('button', { name: 'Entrar', exact: true }).click()
		await expect(page.getByText('Informe um e-mail válido.')).toBeVisible()
		await expect(page.getByText('Informe a senha.')).toBeVisible()
		expect(loginRequests).toBe(0)
	})

	test('mostra e oculta a senha', async ({ page }) => {
		await page.goto('/login')
		const password = page.getByLabel('Senha', { exact: true })

		await expect(password).toHaveAttribute('type', 'password')
		await page.getByRole('button', { name: 'Mostrar senha' }).click()
		await expect(password).toHaveAttribute('type', 'text')
		await page.getByRole('button', { name: 'Ocultar senha' }).click()
		await expect(password).toHaveAttribute('type', 'password')
	})

	test('links de recuperação e solicitação de acesso', async ({ page }) => {
		await page.goto('/login')
		await page.getByRole('link', { name: 'Esqueceu a senha?' }).click()
		await expect(page).toHaveURL(/\/recuperar-senha$/)
		await expect(page.getByText('A recuperação de senha é feita pelo administrador da plataforma.')).toBeVisible()
		await page.getByRole('link', { name: 'Voltar para o login' }).click()
		await page.getByRole('link', { name: 'Solicitar acesso' }).click()
		await expect(page).toHaveURL(/\/solicitar-acesso$/)
		await expect(page.getByText('O acesso à Dockseal é liberado pela equipe responsável.')).toBeVisible()
	})
})

test.describe('sessão', () => {
	test('/login com sessão redireciona para a rota do perfil', async ({ page }) => {
		await seedSession(page, 'GESTOR')
		await page.goto('/login')
		await expect(page).toHaveURL(/\/dashboard$/)
	})

	test('reload mantém a sessão', async ({ page }) => {
		await loginAs(page, 'GESTOR')
		await page.reload()
		await expect(page).toHaveURL(/\/dashboard$/)
		await expect(page.getByRole('heading', { name: 'Visão geral' })).toBeVisible()
	})

	test('me-expired-once renova a sessão e carrega a página', async ({ page }) => {
		await useMockScenario(page, ['me-expired-once'])
		await seedSession(page, 'GESTOR')
		await page.goto('/dashboard')
		await expect(page.getByRole('heading', { name: 'Visão geral' })).toBeVisible()
		await expect(page).toHaveURL(/\/dashboard$/)
	})

	test('refresh-invalid volta para o login e limpa a sessão', async ({ page }) => {
		await useMockScenario(page, ['refresh-invalid'])
		await seedSession(page, 'GESTOR')
		await page.goto('/dashboard')
		await expect(page).toHaveURL(/\/login$/)

		const stored = await page.evaluate((key) => window.localStorage.getItem(key), AUTH_STORAGE_KEY)

		expect(stored ?? '').not.toContain('mock-access')
	})

	test('sair volta para o login e bloqueia rotas protegidas', async ({ page }) => {
		await loginAs(page, 'GESTOR')
		await page.getByRole('button', { name: 'Menu do usuário' }).click()
		await page.getByRole('menuitem', { name: 'Sair' }).click()
		await expect(page).toHaveURL(/\/login$/)
		await page.goto('/dashboard')
		await expect(page).toHaveURL(/\/login$/)
	})
})
