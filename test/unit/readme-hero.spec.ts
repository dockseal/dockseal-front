import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const README_PATH = resolve(process.cwd(), 'README.md')
const HERO_IMAGE = '![Dockseal](https://github.com/user-attachments/assets/b6fb0396-b56f-45f9-81f1-6e1b833613bc)'

function readReadmeLines() {
	return readFileSync(README_PATH, 'utf8').split('\n')
}

describe('README', () => {
	it('mantém o hero intacto nas três primeiras linhas', () => {
		const [heading, blank, image] = readReadmeLines()

		expect(heading).toBe('# Dockseal')
		expect(blank).toBe('')
		expect(image).toBe(HERO_IMAGE)
	})

	it('documenta a execução local e os testes', () => {
		const content = readReadmeLines().join('\n')

		for (const section of [
			'## Sobre',
			'## Pré-requisitos',
			'## Subindo a API',
			'## Configurando o front-end',
			'## Rodando',
			'## Testes',
			'## Mocks',
			'## Configurações, mocks e credenciais para teste manual',
			'## Problemas comuns',
		]) {
			expect(content).toContain(section)
		}
	})
})
