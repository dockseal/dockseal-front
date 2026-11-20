import type { IGetShipmentsFilters, IShipment } from '@/@types/shipment'
import { api } from '@/lib/axios'

export async function getShipments(filters: IGetShipmentsFilters) {
	const params = Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== undefined && value !== ''))
	const response = await api.get<IShipment[]>('/shipments', { params })

	return response.data
}
