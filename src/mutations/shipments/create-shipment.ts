import { type UseMutationOptions, useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import type { ICreateShipmentInput, IShipment } from '@/@types/shipment'
import { createShipment } from '@/api/shipments/create-shipment'
import { invalidateDashboard } from '@/queries/dashboard'
import { invalidateEvents } from '@/queries/events'
import { invalidateShipments } from '@/queries/shipments'
import { getApiErrorMessage } from '@/utils/api-error'

type TUseCreateShipmentOptions = Omit<UseMutationOptions<IShipment, Error, ICreateShipmentInput>, 'mutationFn'>

export function useCreateShipment(options?: TUseCreateShipmentOptions) {
	const { onSuccess, onError, ...rest } = options ?? {}

	return useMutation({
		...rest,
		mutationFn: createShipment,
		onSuccess: async (data, variables, onMutateResult, context) => {
			invalidateShipments()
			invalidateDashboard()
			invalidateEvents()
			toast.success('Embarque registrado.')
			await onSuccess?.(data, variables, onMutateResult, context)
		},
		onError: (error, variables, onMutateResult, context) => {
			toast.error(getApiErrorMessage(error))
			onError?.(error, variables, onMutateResult, context)
		},
	})
}
