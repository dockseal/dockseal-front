export const MAX_UPLOAD_SIZE_MB = 20

export const MAX_UPLOAD_SIZE_BYTES = MAX_UPLOAD_SIZE_MB * 1024 * 1024

export const MAX_FILES_PER_UPLOAD = 10

export const ACCEPTED_UPLOAD_EXTENSIONS = [
	'.pdf',
	'.docx',
	'.txt',
	'.csv',
	'.md',
	'.xml',
	'.json',
	'.png',
	'.jpg',
	'.jpeg',
	'.webp',
] as const

export const ACCEPTED_UPLOAD_ATTRIBUTE = ACCEPTED_UPLOAD_EXTENSIONS.join(',')
