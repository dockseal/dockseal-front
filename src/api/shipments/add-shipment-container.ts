import type { IContainerInput, IShipment } from '@/@types/shipment'
import { api } from '@/lib/axios'

interface IAddShipmentContainerInput {
	shipmentId: string
	container: IContainerInput
}

export async function addShipmentContainer({ shipmentId, container }: IAddShipmentContainerInput) {
	const response = await api.post<IShipment>(`/shipments/${shipmentId}/containers`, container)

	return response.data
}
