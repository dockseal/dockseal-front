import { describe, expect, it } from 'vitest'

import { MAX_UPLOAD_SIZE_BYTES } from '@/constants/upload'
import { formatFileSize, getFileExtension, validateUploadFiles } from '@/utils/file'

function buildFile(name: string, size = 10) {
	const file = new File(['x'], name)

	Object.defineProperty(file, 'size', { value: size })

	return file
}

describe('validateUploadFiles', () => {
	it('exige ao menos um arquivo', () => {
		expect(validateUploadFiles([])).toEqual(['Selecione ao menos um arquivo.'])
	})

	it('bloqueia mais de 10 arquivos', () => {
		const files = Array.from({ length: 11 }, (_, index) => buildFile(`doc-${index}.txt`))

		expect(validateUploadFiles(files)).toEqual(['Envie no máximo 10 arquivos por vez.'])
	})

	it('bloqueia extensão não suportada', () => {
		expect(validateUploadFiles([buildFile('setup.exe')])).toEqual(['setup.exe: formato não suportado.'])
	})

	it('bloqueia arquivo acima de 20 MB', () => {
		expect(validateUploadFiles([buildFile('grande.pdf', MAX_UPLOAD_SIZE_BYTES + 1)])).toEqual([
			'grande.pdf: excede o limite de 20 MB.',
		])
	})

	it('aceita exatamente 20 MB', () => {
		expect(validateUploadFiles([buildFile('limite.pdf', MAX_UPLOAD_SIZE_BYTES)])).toEqual([])
	})

	it('bloqueia arquivo vazio', () => {
		expect(validateUploadFiles([buildFile('vazio.txt', 0)])).toEqual(['vazio.txt: arquivo vazio.'])
	})

	it('aceita extensão em maiúsculas', () => {
		expect(validateUploadFiles([buildFile('FOTO.JPG')])).toEqual([])
		expect(getFileExtension('FOTO.JPG')).toBe('.jpg')
	})
})

describe('formatFileSize', () => {
	it('formata em pt-BR', () => {
		expect(formatFileSize(512)).toBe('512 B')
		expect(formatFileSize(1536)).toBe('1,5 KB')
		expect(formatFileSize(2 * 1024 * 1024)).toBe('2 MB')
	})
})
