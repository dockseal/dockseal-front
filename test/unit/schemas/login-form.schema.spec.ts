import { describe, expect, it } from 'vitest'

import { loginFormSchema } from '@/schemas/auth/login-form.schema'

function messages(input: unknown) {
	const result = loginFormSchema.safeParse(input)

	return result.success ? [] : result.error.issues.map((issue) => issue.message)
}

describe('loginFormSchema', () => {
	it('rejeita e-mail vazio', () => {
		expect(messages({ email: '', password: 'x' })).toContain('Informe um e-mail válido.')
	})

	it('rejeita e-mail inválido', () => {
		expect(messages({ email: 'gestor', password: 'x' })).toContain('Informe um e-mail válido.')
	})

	it('rejeita senha vazia', () => {
		expect(messages({ email: 'gestor@dockseal.test', password: '' })).toContain('Informe a senha.')
	})

	it('aceita senha curta', () => {
		expect(loginFormSchema.safeParse({ email: 'gestor@dockseal.test', password: 'abc' }).success).toBe(true)
	})

	it('normaliza o e-mail para minúsculas', () => {
		const result = loginFormSchema.parse({ email: '  Gestor@DockSeal.test ', password: 'abc' })

		expect(result.email).toBe('gestor@dockseal.test')
	})
})
