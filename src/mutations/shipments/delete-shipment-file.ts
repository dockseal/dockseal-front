import { type UseMutationOptions, useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { deleteShipmentDocument } from '@/api/shipments/delete-shipment-document'
import { deleteShipmentEvidence } from '@/api/shipments/delete-shipment-evidence'
import { invalidateEvents } from '@/queries/events'
import { invalidateShipmentDetail } from '@/queries/shipments'
import { getApiErrorMessage } from '@/utils/api-error'

export interface IDeleteShipmentFileInput {
	shipmentId: string
	fileId: string
	kind: 'document' | 'evidence'
}

type TUseDeleteShipmentFileOptions = Omit<UseMutationOptions<void, Error, IDeleteShipmentFileInput>, 'mutationFn'>

async function deleteShipmentFile({ shipmentId, fileId, kind }: IDeleteShipmentFileInput) {
	if (kind === 'document') {
		await deleteShipmentDocument(shipmentId, fileId)
		return
	}

	await deleteShipmentEvidence(shipmentId, fileId)
}

export function useDeleteShipmentFile(options?: TUseDeleteShipmentFileOptions) {
	const { onSuccess, onError, ...rest } = options ?? {}

	return useMutation({
		...rest,
		mutationFn: deleteShipmentFile,
		onSuccess: async (data, variables, onMutateResult, context) => {
			await invalidateShipmentDetail(variables.shipmentId)
			invalidateEvents()
			toast.success('Arquivo removido.')
			await onSuccess?.(data, variables, onMutateResult, context)
		},
		onError: (error, variables, onMutateResult, context) => {
			toast.error(getApiErrorMessage(error))
			onError?.(error, variables, onMutateResult, context)
		},
	})
}
