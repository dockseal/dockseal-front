import type { IGetShipmentsFilters, IShipment } from '@/@types/shipment'
import { api } from '@/lib/axios'

export async function getShipments(filters: IGetShipmentsFilters) {
	const response = await api.get<IShipment[]>('/shipments', { params: filters })

	return response.data
}
