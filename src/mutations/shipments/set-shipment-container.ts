import { type UseMutationOptions, useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import type { IShipment } from '@/@types/shipment'
import { setShipmentContainer } from '@/api/shipments/set-shipment-container'
import { invalidateEvents } from '@/queries/events'
import { invalidateShipments, mergeShipmentDetailCache } from '@/queries/shipments'
import { getApiErrorMessage } from '@/utils/api-error'

type TSetShipmentContainerVariables = Parameters<typeof setShipmentContainer>[0]

type TUseSetShipmentContainerOptions = Omit<
	UseMutationOptions<IShipment, Error, TSetShipmentContainerVariables>,
	'mutationFn'
>

export function useSetShipmentContainer(options?: TUseSetShipmentContainerOptions) {
	const { onSuccess, onError, ...rest } = options ?? {}

	return useMutation({
		...rest,
		mutationFn: setShipmentContainer,
		onSuccess: async (data, variables, onMutateResult, context) => {
			mergeShipmentDetailCache(data)
			invalidateShipments()
			invalidateEvents()
			toast.success('Contêiner associado.')
			await onSuccess?.(data, variables, onMutateResult, context)
		},
		onError: (error, variables, onMutateResult, context) => {
			toast.error(getApiErrorMessage(error))
			onError?.(error, variables, onMutateResult, context)
		},
	})
}
