import { describe, expect, it } from 'vitest'

import { alertResolutionSchema } from '@/schemas/alerts/alert-resolution.schema'

describe('alertResolutionSchema', () => {
	it('aceita nota vazia', () => {
		expect(alertResolutionSchema.safeParse({ resolutionNote: '' }).success).toBe(true)
	})

	it('aceita 2000 caracteres', () => {
		expect(alertResolutionSchema.safeParse({ resolutionNote: 'a'.repeat(2000) }).success).toBe(true)
	})

	it('rejeita 2001 caracteres', () => {
		const result = alertResolutionSchema.safeParse({ resolutionNote: 'a'.repeat(2001) })

		expect(result.success).toBe(false)
		expect(result.error?.issues[0].message).toBe('Máximo de 2000 caracteres.')
	})
})
