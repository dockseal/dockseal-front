import type { IRefreshSessionInput, IToken } from '@/@types/auth'
import { api } from '@/lib/axios'

export async function refreshSession(input: IRefreshSessionInput) {
	const response = await api.post<IToken>('/auth/refresh', input)

	return response.data
}
