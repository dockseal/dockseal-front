import type { IProcessEvent } from '@/@types/event'
import { EVENTS_LIMIT } from '@/constants/api'
import { api } from '@/lib/axios'

export async function getShipmentEvents(shipmentId: string) {
	const response = await api.get<IProcessEvent[]>(`/shipments/${shipmentId}/events`, {
		params: { limit: EVENTS_LIMIT },
	})

	return response.data
}
