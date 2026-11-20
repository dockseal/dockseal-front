import { api } from '@/lib/axios'

export async function deleteShipmentEvidence(shipmentId: string, evidenceId: string) {
	await api.delete(`/shipments/${shipmentId}/evidences/${evidenceId}`)
}
