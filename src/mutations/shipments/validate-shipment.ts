import { type UseMutationOptions, useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import type { IValidation } from '@/@types/analysis'
import { validateShipment } from '@/api/shipments/validate-shipment'
import { ANALYSIS_STATUS_LABEL } from '@/constants/analysis'
import { invalidateAlerts } from '@/queries/alerts'
import { invalidateDashboard } from '@/queries/dashboard'
import { invalidateEvents } from '@/queries/events'
import { updateShipmentValidationsCache } from '@/queries/shipment-validations'
import { invalidateShipmentDetail, invalidateShipments } from '@/queries/shipments'
import { getApiErrorMessage } from '@/utils/api-error'

type TUseValidateShipmentOptions = Omit<UseMutationOptions<IValidation, Error, string>, 'mutationFn'>

export function useValidateShipment(options?: TUseValidateShipmentOptions) {
	const { onSuccess, onError, ...rest } = options ?? {}

	return useMutation({
		...rest,
		mutationFn: validateShipment,
		onSuccess: async (data, shipmentId, onMutateResult, context) => {
			updateShipmentValidationsCache(shipmentId, (validations) => [data, ...(validations ?? [])])
			invalidateShipmentDetail(shipmentId)
			invalidateShipments()
			invalidateAlerts()
			invalidateDashboard()
			invalidateEvents()
			toast.success(`Validação concluída: ${ANALYSIS_STATUS_LABEL[data.status]}.`)
			await onSuccess?.(data, shipmentId, onMutateResult, context)
		},
		onError: (error, shipmentId, onMutateResult, context) => {
			toast.error(getApiErrorMessage(error))
			onError?.(error, shipmentId, onMutateResult, context)
		},
	})
}
