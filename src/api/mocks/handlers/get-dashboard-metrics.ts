import { HttpResponse, http } from 'msw'

import type { IDashboardMetrics } from '@/@types/dashboard'
import { buildMetrics } from '@/api/mocks/fixtures/metrics'
import { apiUrl, authorize } from '@/api/mocks/http'
import { hasScenario } from '@/api/mocks/scenario'

export const getDashboardMetricsHandler = http.get(apiUrl('/dashboard/metrics'), ({ request }) => {
	const { response } = authorize(request, 'shipment:read')

	if (response) return response

	const metrics = buildMetrics()

	if (hasScenario('metrics-null')) {
		metrics.average_transit_hours = null
		metrics.efficiency_percent = null
	}

	return HttpResponse.json<IDashboardMetrics>(metrics)
})
