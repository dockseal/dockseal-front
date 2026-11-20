import type { IDashboardMetrics } from '@/@types/dashboard'
import { api } from '@/lib/axios'

export async function getDashboardMetrics() {
	const response = await api.get<IDashboardMetrics>('/dashboard/metrics')

	return response.data
}
