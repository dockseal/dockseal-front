import { HttpResponse, http } from 'msw'

import type { IShipmentDetail } from '@/@types/shipment'
import { getDb } from '@/api/mocks/db'
import { apiUrl, authorize, detailResponse } from '@/api/mocks/http'

export const getShipmentHandler = http.get(apiUrl('/shipments/:shipmentId'), ({ request, params }) => {
	const { response } = authorize(request, 'shipment:read')

	if (response) return response

	const db = getDb()
	const shipmentId = String(params.shipmentId)
	const shipment = db.shipments.find((candidate) => candidate.id === shipmentId)

	if (!shipment) return detailResponse(404, 'Embarque não encontrado')

	return HttpResponse.json<IShipmentDetail>({
		...shipment,
		documents: db.documents[shipmentId] ?? [],
		evidences: db.evidences[shipmentId] ?? [],
	})
})
