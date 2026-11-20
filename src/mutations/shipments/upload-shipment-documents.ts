import { type UseMutationOptions, useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import type { IShipmentDocument, IUploadShipmentDocumentsInput } from '@/@types/document'
import { uploadShipmentDocuments } from '@/api/shipments/upload-shipment-documents'
import { invalidateEvents } from '@/queries/events'
import { invalidateShipmentDetail } from '@/queries/shipments'
import { getApiErrorMessage } from '@/utils/api-error'

type TUseUploadShipmentDocumentsOptions = Omit<
	UseMutationOptions<IShipmentDocument[], Error, IUploadShipmentDocumentsInput>,
	'mutationFn'
>

export function useUploadShipmentDocuments(options?: TUseUploadShipmentDocumentsOptions) {
	const { onSuccess, onError, ...rest } = options ?? {}

	return useMutation({
		...rest,
		mutationFn: uploadShipmentDocuments,
		onSuccess: async (data, variables, onMutateResult, context) => {
			await invalidateShipmentDetail(variables.shipmentId)
			invalidateEvents()
			toast.success('Documentos enviados.')
			await onSuccess?.(data, variables, onMutateResult, context)
		},
		onError: (error, variables, onMutateResult, context) => {
			toast.error(getApiErrorMessage(error))
			onError?.(error, variables, onMutateResult, context)
		},
	})
}
