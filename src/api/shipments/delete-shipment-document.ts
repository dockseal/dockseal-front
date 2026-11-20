import { api } from '@/lib/axios'

export async function deleteShipmentDocument(shipmentId: string, documentId: string) {
	await api.delete(`/shipments/${shipmentId}/documents/${documentId}`)
}
