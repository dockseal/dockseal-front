import type { IShipmentDocument, IUploadShipmentDocumentsInput } from '@/@types/document'
import { LONG_REQUEST_TIMEOUT_MS } from '@/constants/api'
import { api } from '@/lib/axios'

export async function uploadShipmentDocuments({ shipmentId, files, onProgress }: IUploadShipmentDocumentsInput) {
	const body = new FormData()

	for (const { file, type } of files) {
		body.append('files', file)
		body.append('types', type)
	}

	const response = await api.post<IShipmentDocument[]>(`/shipments/${shipmentId}/documents`, body, {
		timeout: LONG_REQUEST_TIMEOUT_MS,
		onUploadProgress: (event) => {
			if (event.total) onProgress?.(Math.round((event.loaded / event.total) * 100))
		},
	})

	return response.data
}
