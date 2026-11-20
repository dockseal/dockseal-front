import type { IShipmentDetail } from '@/@types/shipment'
import { api } from '@/lib/axios'

export async function getShipment(shipmentId: string) {
	const response = await api.get<IShipmentDetail>(`/shipments/${shipmentId}`)

	return response.data
}
