import { HttpResponse, http } from 'msw'

import type { IValidation } from '@/@types/analysis'
import { getDb } from '@/api/mocks/db'
import { apiUrl, authorize, detailResponse } from '@/api/mocks/http'

export const getShipmentValidationsHandler = http.get(
	apiUrl('/shipments/:shipmentId/validations'),
	({ request, params }) => {
		const { response } = authorize(request, 'shipment:read')

		if (response) return response

		const db = getDb()
		const shipmentId = String(params.shipmentId)

		if (!db.shipments.some((shipment) => shipment.id === shipmentId)) {
			return detailResponse(404, 'Embarque não encontrado')
		}

		return HttpResponse.json<IValidation[]>(db.validations[shipmentId] ?? [])
	},
)
