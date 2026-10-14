import { useQuery } from '@tanstack/react-query'

import type { IValidation } from '@/@types/analysis'
import { getShipmentValidations } from '@/api/shipments/get-shipment-validations'
import { queryClient } from '@/lib/query-client'

export const shipmentValidationsQueryKeys = {
	all: ['shipment-validations'] as const,
	list: (shipmentId: string) => [...shipmentValidationsQueryKeys.all, shipmentId] as const,
}

export function useShipmentValidations(shipmentId: string, { enabled = true }: { enabled?: boolean } = {}) {
	return useQuery({
		queryKey: shipmentValidationsQueryKeys.list(shipmentId),
		queryFn: () => getShipmentValidations(shipmentId),
		enabled,
	})
}

export function updateShipmentValidationsCache(
	shipmentId: string,
	updater: (validations: IValidation[] | undefined) => IValidation[] | undefined,
) {
	queryClient.setQueryData<IValidation[]>(shipmentValidationsQueryKeys.list(shipmentId), updater)
}

export function invalidateShipmentValidations(shipmentId: string) {
	return queryClient.invalidateQueries({ queryKey: shipmentValidationsQueryKeys.list(shipmentId) })
}
