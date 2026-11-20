import { HttpResponse, http } from 'msw'

import type { IProcessEvent } from '@/@types/event'
import { getDb } from '@/api/mocks/db'
import { apiUrl, authorize, detailResponse } from '@/api/mocks/http'
import { hasScenario } from '@/api/mocks/scenario'

export const getShipmentEventsHandler = http.get(apiUrl('/shipments/:shipmentId/events'), ({ request, params }) => {
	const { response } = authorize(request, 'history:read')

	if (response) return response

	const db = getDb()
	const shipmentId = String(params.shipmentId)

	if (!db.shipments.some((shipment) => shipment.id === shipmentId)) {
		return detailResponse(404, 'Embarque não encontrado')
	}

	if (hasScenario('events-empty')) return HttpResponse.json<IProcessEvent[]>([])

	const limit = Number(new URL(request.url).searchParams.get('limit') ?? 100)

	return HttpResponse.json<IProcessEvent[]>(
		db.events.filter((event) => event.shipment_id === shipmentId).slice(0, limit),
	)
})
