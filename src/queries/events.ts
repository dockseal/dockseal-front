import { useQuery } from '@tanstack/react-query'

import type { IGetEventsFilters } from '@/@types/event'
import { getEvents } from '@/api/events/get-events'
import { getShipmentEvents } from '@/api/shipments/get-shipment-events'
import { queryClient } from '@/lib/query-client'

export const eventsQueryKeys = {
	all: ['events'] as const,
	list: (filters: IGetEventsFilters) => [...eventsQueryKeys.all, 'list', filters] as const,
	shipment: (shipmentId: string) => [...eventsQueryKeys.all, 'shipment', shipmentId] as const,
}

export function useEvents(filters: IGetEventsFilters) {
	return useQuery({
		queryKey: eventsQueryKeys.list(filters),
		queryFn: () => getEvents(filters),
	})
}

export function useShipmentEvents(shipmentId: string, { enabled = true }: { enabled?: boolean } = {}) {
	return useQuery({
		queryKey: eventsQueryKeys.shipment(shipmentId),
		queryFn: () => getShipmentEvents(shipmentId),
		enabled,
	})
}

export function invalidateEvents() {
	return queryClient.invalidateQueries({ queryKey: eventsQueryKeys.all })
}
