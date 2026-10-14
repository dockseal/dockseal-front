import type { ILoginInput, ILoginResponse } from '@/@types/auth'
import { api } from '@/lib/axios'

export async function login(input: ILoginInput) {
	const body = new URLSearchParams({ username: input.username, password: input.password })
	const response = await api.post<ILoginResponse>('/auth/login', body, {
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
	})

	return response.data
}
