import { HttpResponse, http } from 'msw'

import type { ICreateShipmentInput, IShipment } from '@/@types/shipment'
import { attachMockContainer } from '@/api/mocks/attach-container'
import { getDb, registerMockEvent } from '@/api/mocks/db'
import { apiUrl, authorize, detailResponse } from '@/api/mocks/http'
import { hasScenario } from '@/api/mocks/scenario'
import { INVALID_DATE_MESSAGE } from '@/constants/shipment'
import { startOfTodayUtc } from '@/utils/date'

export const createShipmentHandler = http.post(apiUrl('/shipments'), async ({ request }) => {
	const { user, response } = authorize(request, 'shipment:write')

	if (response) return response

	const body = (await request.json()) as ICreateShipmentInput
	const missing = (['origin', 'destination'] as const).filter((field) => !body[field]?.trim())

	if (missing.length > 0) {
		return HttpResponse.json(
			{
				detail: missing.map((field) => ({
					type: 'string_too_short',
					loc: ['body', field],
					msg: 'String should have at least 1 character',
				})),
			},
			{ status: 422 },
		)
	}

	const invalidDateFields = (['dispatched_at', 'expected_arrival', 'expected_return'] as const).filter((field) => {
		const value = body[field]

		return value !== undefined && value !== null && Number.isNaN(new Date(value).getTime())
	})

	if (invalidDateFields.length > 0) {
		return HttpResponse.json(
			{
				detail: invalidDateFields.map((field) => ({
					type: 'value_error',
					loc: ['body', field],
					msg: `Value error, ${INVALID_DATE_MESSAGE}`,
				})),
			},
			{ status: 422 },
		)
	}

	if (body.dispatched_at && body.expected_return && body.expected_return < body.dispatched_at) {
		return detailResponse(422, 'Retorno previsto não pode ser anterior ao despacho')
	}

	if (body.dispatched_at && body.expected_arrival && body.expected_arrival < body.dispatched_at) {
		return detailResponse(422, 'Chegada prevista não pode ser anterior ao despacho')
	}

	if (body.expected_arrival && body.expected_return && body.expected_return < body.expected_arrival) {
		return detailResponse(422, 'Retorno previsto não pode ser anterior à chegada prevista')
	}

	const pastArrival = body.expected_arrival && new Date(body.expected_arrival) < startOfTodayUtc()

	if (hasScenario('shipment-create-past-arrival') || pastArrival) {
		return detailResponse(422, 'Data de chegada prevista não pode ser anterior a hoje')
	}

	const db = getDb()
	const customId = body.shipment_id_custom?.trim() || null
	const duplicate = customId && db.shipments.some((shipment) => shipment.shipment_id_custom === customId)

	if (hasScenario('shipment-create-duplicate') || duplicate) {
		return detailResponse(422, 'Identificador de embarque já cadastrado')
	}

	const shipment: IShipment = {
		id: crypto.randomUUID(),
		origin: body.origin.trim(),
		destination: body.destination.trim(),
		shipment_id_custom: customId,
		transport_company: body.transport_company ?? null,
		dispatched_at: body.dispatched_at ?? null,
		expected_arrival: body.expected_arrival ?? null,
		expected_return: body.expected_return ?? null,
		returned_at: null,
		status: 'REGISTERED',
		container: null,
		containers: [],
		created_at: new Date().toISOString(),
	}

	if (body.container) {
		const containerError = attachMockContainer(shipment, body.container, { replacePrimary: false, userId: user.id })

		if (containerError) return containerError
	}

	db.shipments.unshift(shipment)
	registerMockEvent({ step: 'SHIPMENT_CREATED', status: 'SUCCESS', user_id: user.id, shipment_id: shipment.id })

	return HttpResponse.json<IShipment>(shipment, { status: 201 })
})
