import { z } from 'zod'

export const emailFieldSchema = z
	.string()
	.trim()
	.toLowerCase()
	.pipe(z.email('Informe um e-mail válido.').max(254, 'E-mail muito longo.'))

export const requiredPasswordFieldSchema = z.string().min(1, 'Informe a senha.')
