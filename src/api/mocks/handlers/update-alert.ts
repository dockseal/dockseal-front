import { HttpResponse, http } from 'msw'

import type { IAlert, IUpdateAlertInput } from '@/@types/alert'
import { getDb, registerMockEvent } from '@/api/mocks/db'
import { apiUrl, authorize, detailResponse } from '@/api/mocks/http'
import { hasScenario } from '@/api/mocks/scenario'
import { ALERT_STATUSES } from '@/constants/alert'

export const updateAlertHandler = http.patch(apiUrl('/alerts/:alertId'), async ({ request, params }) => {
	const { user, response } = authorize(request, 'alert:manage')

	if (response) return response

	const alert = getDb().alerts.find((candidate) => candidate.id === params.alertId)

	if (hasScenario('alert-patch-404') || !alert) return detailResponse(404, 'Alerta não encontrado')

	const body = (await request.json()) as IUpdateAlertInput

	if (!ALERT_STATUSES.includes(body.status)) {
		return HttpResponse.json(
			{ detail: [{ type: 'enum', loc: ['body', 'status'], msg: 'Input should be a valid status' }] },
			{ status: 422 },
		)
	}

	alert.status = body.status

	if ('resolution_note' in body) {
		alert.resolution_note = body.resolution_note ?? null
	}

	alert.updated_at = new Date().toISOString()
	registerMockEvent({
		step: `ALERT_${body.status}`,
		status: 'SUCCESS',
		user_id: user.id,
		shipment_id: alert.shipment_id,
		observation: alert.resolution_note ?? undefined,
	})

	return HttpResponse.json<IAlert>(alert)
})
