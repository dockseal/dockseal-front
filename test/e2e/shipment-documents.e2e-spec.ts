import { expect, type Page, test } from '@playwright/test'

import { pngFile, sizedFile, textFile } from './support/files'
import { useMockScenario } from './support/mock-scenario'
import { seedSession } from './support/session'

const DOCUMENTS_TAB = '/embarques/a0000000-0000-4000-8000-000000000003?tab=documentos'

async function chooseType(page: Page, fileName: string, typeLabel: string) {
	await page.getByRole('combobox', { name: `Tipo de ${fileName}` }).click()
	await page.getByRole('option', { name: typeLabel, exact: true }).click()
}

function trackUploads(page: Page) {
	const counter = { count: 0 }

	page.on('request', (request) => {
		if (request.method() === 'POST' && request.url().includes('/documents')) counter.count++
	})

	return counter
}

test('envia dois arquivos com tipos diferentes e lista os documentos', async ({ page }) => {
	await seedSession(page, 'OPERADOR')
	await page.goto(DOCUMENTS_TAB)
	await expect(page.getByText('Nenhum documento enviado.')).toBeVisible()
	await page.getByLabel('Selecione ou arraste arquivos').setInputFiles([textFile('bl.txt'), textFile('nf.txt')])
	await chooseType(page, 'bl.txt', 'Bill of Lading')
	await chooseType(page, 'nf.txt', 'Nota Fiscal')
	await page.getByRole('button', { name: 'Enviar documentos' }).click()
	await expect(page.getByText(/Enviando…/)).toBeVisible()
	await expect(page.getByText('Documentos enviados.')).toBeVisible()

	const table = page.getByRole('table')

	await expect(table.getByRole('row').filter({ hasText: 'bl.txt' })).toContainText('Bill of Lading')
	await expect(table.getByRole('row').filter({ hasText: 'nf.txt' })).toContainText('Nota Fiscal')
	await expect(page.getByText('Nenhum documento enviado.')).toHaveCount(0)
})

test('foto do contêiner aparece nas evidências', async ({ page }) => {
	await seedSession(page, 'OPERADOR')
	await page.goto(DOCUMENTS_TAB)
	await page.getByLabel('Selecione ou arraste arquivos').setInputFiles([pngFile('foto.png')])
	await chooseType(page, 'foto.png', 'Foto do contêiner')
	await page.getByRole('button', { name: 'Enviar documentos' }).click()
	await expect(page.getByRole('img', { name: 'Evidência: Foto do contêiner' })).toBeVisible()
})

test('bloqueia .exe e arquivo de 21 MB sem chamar a API', async ({ page }) => {
	const uploads = trackUploads(page)

	await seedSession(page, 'OPERADOR')
	await page.goto(DOCUMENTS_TAB)
	await page
		.getByLabel('Selecione ou arraste arquivos')
		.setInputFiles([
			{ name: 'setup.exe', mimeType: 'application/octet-stream', buffer: Buffer.from('x') },
			sizedFile('grande.pdf', 21 * 1024 * 1024),
		])
	await expect(page.getByText('setup.exe: formato não suportado.')).toBeVisible()
	await expect(page.getByText('grande.pdf: excede o limite de 20 MB.')).toBeVisible()
	await expect(page.getByRole('button', { name: 'Enviar documentos' })).toBeDisabled()
	expect(uploads.count).toBe(0)
})

for (const [scenario, detail] of [
	['upload-413', "'bl.txt' excede o limite de 20 MB"],
	['upload-415', "Formato de 'bl.txt' não é suportado"],
	['upload-422-empty-text', "Nenhum texto encontrado em 'bl.txt'"],
] as const) {
	test(`${scenario} mostra o detail da API`, async ({ page }) => {
		await useMockScenario(page, [scenario])
		await seedSession(page, 'OPERADOR')
		await page.goto(DOCUMENTS_TAB)
		await page.getByLabel('Selecione ou arraste arquivos').setInputFiles([textFile('bl.txt')])
		await page.getByRole('button', { name: 'Enviar documentos' }).click()
		await expect(page.getByText(detail)).toBeVisible()
	})
}

test('gestor não vê o envio de documentos', async ({ page }) => {
	await seedSession(page, 'GESTOR')
	await page.goto('/embarques/a0000000-0000-4000-8000-000000000001?tab=documentos')
	await expect(page.getByRole('row').filter({ hasText: 'bill_of_lading.pdf' })).toBeVisible()
	await expect(page.getByLabel('Selecione ou arraste arquivos')).toHaveCount(0)
})
