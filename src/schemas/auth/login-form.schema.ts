import { z } from 'zod'

import { emailFieldSchema, requiredPasswordFieldSchema } from '@/schemas/fields.schema'

export const loginFormSchema = z.object({
	email: emailFieldSchema,
	password: requiredPasswordFieldSchema,
})

export type TLoginFormValues = z.infer<typeof loginFormSchema>
