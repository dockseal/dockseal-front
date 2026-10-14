import type { IUser } from '@/@types/auth'
import { api } from '@/lib/axios'

export async function getMe() {
	const response = await api.get<IUser>('/auth/me')

	return response.data
}
