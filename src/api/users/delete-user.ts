import { api } from '@/lib/axios'

export async function deleteUser(userId: string) {
	await api.delete(`/users/${userId}`)
}
