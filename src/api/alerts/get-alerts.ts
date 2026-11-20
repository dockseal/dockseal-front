import type { IAlert, IGetAlertsFilters } from '@/@types/alert'
import { api } from '@/lib/axios'

export async function getAlerts(filters: IGetAlertsFilters) {
	const params = Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== undefined))
	const response = await api.get<IAlert[]>('/alerts', { params })

	return response.data
}
