import type { IValidation } from '@/@types/analysis'
import { api } from '@/lib/axios'

export async function getShipmentValidations(shipmentId: string) {
	const response = await api.get<IValidation[]>(`/shipments/${shipmentId}/validations`)

	return response.data
}
