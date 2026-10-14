import { HttpResponse, http } from 'msw'

import type { IShipment } from '@/@types/shipment'
import { getDb } from '@/api/mocks/db'
import { apiUrl, authorize } from '@/api/mocks/http'
import { hasScenario } from '@/api/mocks/scenario'

export const getShipmentsHandler = http.get(apiUrl('/shipments'), ({ request }) => {
	const { response } = authorize(request, 'shipment:read')

	if (response) return response

	if (hasScenario('network-error')) return HttpResponse.error()

	if (hasScenario('shipments-empty')) return HttpResponse.json<IShipment[]>([])

	const url = new URL(request.url)
	const limit = Number(url.searchParams.get('limit') ?? 50)
	const offset = Number(url.searchParams.get('offset') ?? 0)
	const shipments = [...getDb().shipments].sort((a, b) => b.created_at.localeCompare(a.created_at))

	return HttpResponse.json<IShipment[]>(shipments.slice(offset, offset + limit))
})
