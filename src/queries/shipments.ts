import { keepPreviousData, useQuery } from '@tanstack/react-query'

import type { IGetShipmentsFilters, IShipment, IShipmentDetail } from '@/@types/shipment'
import { getShipment } from '@/api/shipments/get-shipment'
import { getShipments } from '@/api/shipments/get-shipments'
import { queryClient } from '@/lib/query-client'

export const shipmentsQueryKeys = {
	all: ['shipments'] as const,
	lists: () => [...shipmentsQueryKeys.all, 'list'] as const,
	list: (filters: IGetShipmentsFilters) => [...shipmentsQueryKeys.lists(), filters] as const,
	detail: (shipmentId: string) => [...shipmentsQueryKeys.all, 'detail', shipmentId] as const,
}

export function useShipments(filters: IGetShipmentsFilters) {
	return useQuery({
		queryKey: shipmentsQueryKeys.list(filters),
		queryFn: () => getShipments(filters),
		placeholderData: keepPreviousData,
	})
}

export function useShipment(shipmentId: string) {
	return useQuery({
		queryKey: shipmentsQueryKeys.detail(shipmentId),
		queryFn: () => getShipment(shipmentId),
	})
}

export function updateShipmentDetailCache(
	shipmentId: string,
	updater: (shipment: IShipmentDetail | undefined) => IShipmentDetail | undefined,
) {
	queryClient.setQueryData<IShipmentDetail>(shipmentsQueryKeys.detail(shipmentId), updater)
}

export function mergeShipmentDetailCache(shipment: IShipment) {
	updateShipmentDetailCache(shipment.id, (current) =>
		current ? { ...current, ...shipment } : { ...shipment, documents: [], evidences: [] },
	)
}

export function invalidateShipments() {
	return queryClient.invalidateQueries({ queryKey: shipmentsQueryKeys.lists() })
}

export function invalidateShipmentDetail(shipmentId: string) {
	return queryClient.invalidateQueries({ queryKey: shipmentsQueryKeys.detail(shipmentId) })
}
