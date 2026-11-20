import type { ICreateShipmentInput, IShipment } from '@/@types/shipment'
import { api } from '@/lib/axios'

export async function createShipment(input: ICreateShipmentInput) {
	const response = await api.post<IShipment>('/shipments', input)

	return response.data
}
