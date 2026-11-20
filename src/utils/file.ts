import { ACCEPTED_UPLOAD_EXTENSIONS, MAX_FILES_PER_UPLOAD, MAX_UPLOAD_SIZE_BYTES } from '@/constants/upload'

export function getFileExtension(name: string) {
	const index = name.lastIndexOf('.')

	return index >= 0 ? name.slice(index).toLowerCase() : ''
}

export function validateUploadFiles(files: File[]) {
	if (files.length === 0) return ['Selecione ao menos um arquivo.']

	if (files.length > MAX_FILES_PER_UPLOAD) return [`Envie no máximo ${MAX_FILES_PER_UPLOAD} arquivos por vez.`]

	const accepted: readonly string[] = ACCEPTED_UPLOAD_EXTENSIONS
	const errors: string[] = []

	for (const file of files) {
		if (!accepted.includes(getFileExtension(file.name))) {
			errors.push(`${file.name}: formato não suportado.`)
		} else if (file.size > MAX_UPLOAD_SIZE_BYTES) {
			errors.push(`${file.name}: excede o limite de 20 MB.`)
		} else if (file.size === 0) {
			errors.push(`${file.name}: arquivo vazio.`)
		}
	}

	return errors
}

export function formatFileSize(bytes: number) {
	if (bytes < 1024) return `${bytes} B`

	if (bytes < 1024 * 1024) return `${(bytes / 1024).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} KB`

	return `${(bytes / (1024 * 1024)).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} MB`
}
