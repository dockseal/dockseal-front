import type { IContainerInput, IShipment } from '@/@types/shipment'
import { api } from '@/lib/axios'

interface ISetShipmentContainerInput {
	shipmentId: string
	container: IContainerInput
}

export async function setShipmentContainer({ shipmentId, container }: ISetShipmentContainerInput) {
	const response = await api.put<IShipment>(`/shipments/${shipmentId}/container`, container)

	return response.data
}
