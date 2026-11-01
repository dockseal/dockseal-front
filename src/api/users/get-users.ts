import type { IGetUsersFilters, IUser } from '@/@types/auth'
import { api } from '@/lib/axios'

export async function getUsers(filters: IGetUsersFilters) {
	const response = await api.get<IUser[]>('/users', { params: filters })

	return response.data
}
