import type { IUpdateUserInput, IUser } from '@/@types/auth'
import { api } from '@/lib/axios'

export async function updateUser(userId: string, input: IUpdateUserInput) {
	const response = await api.patch<IUser>(`/users/${userId}`, input)

	return response.data
}
