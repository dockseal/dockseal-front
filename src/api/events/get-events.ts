import type { IGetEventsFilters, IProcessEvent } from '@/@types/event'
import { api } from '@/lib/axios'

export async function getEvents(filters: IGetEventsFilters) {
	const response = await api.get<IProcessEvent[]>('/events', { params: filters })

	return response.data
}
