import { useQuery } from '@tanstack/react-query'

import { getDashboardMetrics } from '@/api/dashboard/get-dashboard-metrics'
import { queryClient } from '@/lib/query-client'

export const dashboardQueryKeys = {
	all: ['dashboard'] as const,
	metrics: () => [...dashboardQueryKeys.all, 'metrics'] as const,
}

export function useDashboardMetrics() {
	return useQuery({
		queryKey: dashboardQueryKeys.metrics(),
		queryFn: getDashboardMetrics,
	})
}

export function invalidateDashboard() {
	return queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.all })
}
