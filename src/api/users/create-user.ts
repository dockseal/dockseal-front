import type { ICreateUserInput, IUser } from '@/@types/auth'
import { api } from '@/lib/axios'

export async function createUser(input: ICreateUserInput) {
	const response = await api.post<IUser>('/users', input)

	return response.data
}
