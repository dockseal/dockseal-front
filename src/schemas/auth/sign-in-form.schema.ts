import { z } from 'zod'

import { emailFieldSchema, passwordFieldSchema } from '@/schemas/fields.schema'

export const signInFormSchema = z.object({
	email: emailFieldSchema,
	password: passwordFieldSchema,
})

export type TSignInFormValues = z.infer<typeof signInFormSchema>
