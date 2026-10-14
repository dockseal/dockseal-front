import { HttpResponse, http } from 'msw'

import type { IProcessEvent } from '@/@types/event'
import { getDb } from '@/api/mocks/db'
import { apiUrl, authorize } from '@/api/mocks/http'
import { hasScenario } from '@/api/mocks/scenario'

export const getEventsHandler = http.get(apiUrl('/events'), ({ request }) => {
	const { response } = authorize(request, 'history:read')

	if (response) return response

	if (hasScenario('events-empty')) return HttpResponse.json<IProcessEvent[]>([])

	const url = new URL(request.url)
	const shipmentId = url.searchParams.get('shipment_id')
	const limit = Number(url.searchParams.get('limit') ?? 100)
	const events = getDb().events.filter((event) => !shipmentId || event.shipment_id === shipmentId)

	return HttpResponse.json<IProcessEvent[]>(events.slice(0, limit))
})
