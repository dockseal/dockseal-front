import { HttpResponse, http } from 'msw'

import type { IContainerInput, IShipment } from '@/@types/shipment'
import { attachMockContainer } from '@/api/mocks/attach-container'
import { getDb } from '@/api/mocks/db'
import { apiUrl, authorize, detailResponse } from '@/api/mocks/http'

export const setShipmentContainerHandler = http.put(
	apiUrl('/shipments/:shipmentId/container'),
	async ({ request, params }) => {
		const { user, response } = authorize(request, 'shipment:write')

		if (response) return response

		const shipment = getDb().shipments.find((candidate) => candidate.id === params.shipmentId)

		if (!shipment) return detailResponse(404, 'Embarque não encontrado')

		const body = (await request.json()) as IContainerInput
		const error = attachMockContainer(shipment, body, { replacePrimary: true, userId: user.id })

		if (error) return error

		return HttpResponse.json<IShipment>(shipment)
	},
)
