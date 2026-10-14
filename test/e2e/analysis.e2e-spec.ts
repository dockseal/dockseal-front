import { expect, type Page, test } from '@playwright/test'

import { textFile } from './support/files'
import { useMockScenario } from './support/mock-scenario'
import { seedSession } from './support/session'

async function analyze(page: Page, names: string[]) {
	await page.goto('/analise')
	await page.getByLabel('Selecione ou arraste arquivos').setInputFiles(names.map((name) => textFile(name)))
	await page.getByRole('button', { name: 'Analisar documentos' }).click()
}

test('resultado divergente mostra ocorrências, correção, ausentes e conferidos', async ({ page }) => {
	await seedSession(page, 'OPERADOR')
	await analyze(page, ['bl.txt', 'nf.txt'])
	await expect(page.getByText('Divergente', { exact: true })).toBeVisible()
	await expect(page.getByText('Confiança: 95%')).toBeVisible()

	const critical = page.getByRole('article', { name: 'Divergência: número do contêiner' })

	await expect(critical.getByRole('row').filter({ hasText: 'MSCU7654321' })).toContainText('nf.txt')
	await expect(critical).toContainText('Corrigir em: nf.txt')
	await expect(page.getByRole('article', { name: 'Divergência: peso bruto' })).toContainText(
		'Requer conferência humana',
	)
	await expect(page.getByText('SL-884599 [?]').first()).toBeVisible()
	await expect(page.getByRole('heading', { name: 'Campos ausentes' })).toBeVisible()
	await expect(page.getByText('porto de destino', { exact: true })).toBeVisible()
	await expect(page.getByText('exportador')).toBeVisible()
})

test('resultado conforme', async ({ page }) => {
	await useMockScenario(page, ['analysis-conforme'])
	await seedSession(page, 'OPERADOR')
	await analyze(page, ['bl.txt'])
	await expect(page.getByText('Conforme', { exact: true })).toBeVisible()
	await expect(page.getByText('Os documentos estão coerentes entre si.')).toBeVisible()
	await expect(page.getByRole('article')).toHaveCount(0)
})

test('resultado inconclusivo', async ({ page }) => {
	await useMockScenario(page, ['analysis-inconclusivo'])
	await seedSession(page, 'GESTOR')
	await analyze(page, ['bl.txt'])
	await expect(page.getByText('Inconclusivo', { exact: true })).toBeVisible()
	await expect(page.getByText('Confiança: 30%')).toBeVisible()
})

test('formato recusado mostra o detail 415', async ({ page }) => {
	await useMockScenario(page, ['analysis-415'])
	await seedSession(page, 'OPERADOR')
	await analyze(page, ['bl.txt'])
	await expect(page.getByText("Formato de 'bl.txt' não é suportado")).toBeVisible()
})

test('falha da IA mostra a mensagem de 502', async ({ page }) => {
	await useMockScenario(page, ['analysis-502'])
	await seedSession(page, 'OPERADOR')
	await analyze(page, ['bl.txt'])
	await expect(page.getByText('Não foi possível analisar agora. Tente novamente em instantes.')).toBeVisible()
})

test('11 arquivos são bloqueados no cliente', async ({ page }) => {
	let posts = 0

	page.on('request', (request) => {
		if (request.method() === 'POST' && request.url().endsWith('/analysis')) posts++
	})

	await seedSession(page, 'OPERADOR')
	await page.goto('/analise')
	await page
		.getByLabel('Selecione ou arraste arquivos')
		.setInputFiles(Array.from({ length: 11 }, (_, index) => textFile(`doc-${index}.txt`)))
	await expect(page.getByText('Envie no máximo 10 arquivos por vez.')).toBeVisible()
	await expect(page.getByRole('button', { name: 'Analisar documentos' })).toBeDisabled()
	expect(posts).toBe(0)
})

test('mostra estado pendente durante a análise', async ({ page }) => {
	await seedSession(page, 'OPERADOR')
	await analyze(page, ['bl.txt'])
	await expect(page.getByRole('status').filter({ hasText: 'Analisando documentos com IA.' })).toBeVisible()
	await expect(page.getByText('Divergente', { exact: true })).toBeVisible()
})
