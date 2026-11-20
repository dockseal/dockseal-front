import { useQuery } from '@tanstack/react-query'

import type { IAlert, IGetAlertsFilters } from '@/@types/alert'
import { getAlerts } from '@/api/alerts/get-alerts'
import { queryClient } from '@/lib/query-client'

export const alertsQueryKeys = {
	all: ['alerts'] as const,
	list: (filters: IGetAlertsFilters) => [...alertsQueryKeys.all, 'list', filters] as const,
}

export function useAlerts(filters: IGetAlertsFilters) {
	return useQuery({
		queryKey: alertsQueryKeys.list(filters),
		queryFn: () => getAlerts(filters),
	})
}

export function updateAlertsCache(alert: IAlert) {
	queryClient.setQueriesData<IAlert[]>({ queryKey: alertsQueryKeys.all }, (alerts) =>
		alerts?.map((current) => (current.id === alert.id ? alert : current)),
	)
}

export function invalidateAlerts() {
	return queryClient.invalidateQueries({ queryKey: alertsQueryKeys.all })
}
