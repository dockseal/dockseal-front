import { HttpResponse, http } from 'msw'

import type { IAlert } from '@/@types/alert'
import { getDb } from '@/api/mocks/db'
import { apiUrl, authorize } from '@/api/mocks/http'
import { hasScenario } from '@/api/mocks/scenario'
import { SEVERITY_ORDER } from '@/constants/alert'

export const getAlertsHandler = http.get(apiUrl('/alerts'), ({ request }) => {
	const { response } = authorize(request, 'alert:read')

	if (response) return response

	if (hasScenario('alerts-empty')) return HttpResponse.json<IAlert[]>([])

	const url = new URL(request.url)
	const status = url.searchParams.get('status')
	const severity = url.searchParams.get('severity')
	const shipmentId = url.searchParams.get('shipment_id')
	const alerts = getDb()
		.alerts.filter(
			(alert) =>
				(!status || alert.status === status) &&
				(!severity || alert.severity === severity) &&
				(!shipmentId || alert.shipment_id === shipmentId),
		)
		.sort(
			(a, b) =>
				SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity) ||
				b.created_at.localeCompare(a.created_at),
		)

	return HttpResponse.json<IAlert[]>(alerts)
})
