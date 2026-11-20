import type { IValidation } from '@/@types/analysis'
import { LONG_REQUEST_TIMEOUT_MS } from '@/constants/api'
import { api } from '@/lib/axios'

export async function validateShipment(shipmentId: string) {
	const response = await api.post<IValidation>(`/shipments/${shipmentId}/validate`, undefined, {
		timeout: LONG_REQUEST_TIMEOUT_MS,
	})

	return response.data
}
