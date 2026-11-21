import { z } from 'zod'

import { getContainerNumberError } from '@/utils/container'

function addContainerNumberIssue(value: string, context: z.RefinementCtx) {
	const message = getContainerNumberError(value)

	if (message) context.addIssue({ code: 'custom', message })
}

export const optionalContainerNumberSchema = z
	.string()
	.trim()
	.superRefine((value, context) => {
		if (value !== '') addContainerNumberIssue(value, context)
	})

export const requiredContainerNumberSchema = z
	.string()
	.trim()
	.min(1, 'Informe o número do contêiner.')
	.superRefine(addContainerNumberIssue)
