import { z } from 'zod'

import { requiredContainerNumberSchema } from '@/schemas/shipments/container-number.schema'

export const containerFormSchema = z.object({
	containerNumber: requiredContainerNumberSchema,
	type: z.string().trim().max(50, 'Máximo de 50 caracteres.'),
	owner: z.string().trim().max(100, 'Máximo de 100 caracteres.'),
	mode: z.enum(['primary', 'additional']),
})

export type TContainerFormValues = z.infer<typeof containerFormSchema>
