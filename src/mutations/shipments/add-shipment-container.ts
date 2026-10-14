import { type UseMutationOptions, useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import type { IShipment } from '@/@types/shipment'
import { addShipmentContainer } from '@/api/shipments/add-shipment-container'
import { invalidateEvents } from '@/queries/events'
import { invalidateShipments, mergeShipmentDetailCache } from '@/queries/shipments'
import { getApiErrorMessage } from '@/utils/api-error'

type TAddShipmentContainerVariables = Parameters<typeof addShipmentContainer>[0]

type TUseAddShipmentContainerOptions = Omit<
	UseMutationOptions<IShipment, Error, TAddShipmentContainerVariables>,
	'mutationFn'
>

export function useAddShipmentContainer(options?: TUseAddShipmentContainerOptions) {
	const { onSuccess, onError, ...rest } = options ?? {}

	return useMutation({
		...rest,
		mutationFn: addShipmentContainer,
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
