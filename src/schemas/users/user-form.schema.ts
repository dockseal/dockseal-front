import { z } from 'zod'

import { EUserRole } from '@/constants/auth'
import { emailFieldSchema } from '@/schemas/fields.schema'

export const USER_PASSWORD_MESSAGE =
	'Senha deve ter no mínimo 8 caracteres, com maiúscula, minúscula, número e caractere especial.'

const userNameSchema = z.string().trim().min(1, 'Informe o nome.').max(150, 'Máximo de 150 caracteres.')

const userRoleSchema = z.enum([EUserRole.OPERADOR, EUserRole.GESTOR, EUserRole.ADMIN], {
	error: 'Selecione o perfil.',
})

export const userPasswordSchema = z
	.string()
	.refine(
		(value) =>
			value.length >= 8 && /[A-Z]/.test(value) && /[a-z]/.test(value) && /\d/.test(value) && /[^A-Za-z0-9]/.test(value),
		USER_PASSWORD_MESSAGE,
	)

export const createUserFormSchema = z.object({
	name: userNameSchema,
	email: emailFieldSchema,
	role: userRoleSchema,
	password: userPasswordSchema,
})

export const updateUserFormSchema = z.object({
	name: userNameSchema,
	email: emailFieldSchema,
	role: userRoleSchema,
	status: z.enum(['ACTIVE', 'INACTIVE']),
	password: z.union([z.literal(''), userPasswordSchema]),
})

export type TCreateUserFormValues = z.infer<typeof createUserFormSchema>
export type TUpdateUserFormValues = z.infer<typeof updateUserFormSchema>
