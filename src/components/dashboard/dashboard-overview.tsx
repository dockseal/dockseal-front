import { BadgeCheck } from 'lucide-react'

import { DashboardPanel } from '@/components/dashboard/dashboard-panel'
import { KpiCard } from '@/components/dashboard/kpi-card'
import { OpenAlerts } from '@/components/dashboard/open-alerts'
import { RecentShipments } from '@/components/dashboard/recent-shipments'
import { VolumeTrendChart } from '@/components/dashboard/volume-trend-chart'
import { ErrorState } from '@/components/feedback/error-state'
import { LoadingState } from '@/components/feedback/loading-state'
import { PageHeader } from '@/components/page-header'
import { EPermission } from '@/constants/auth'
import { usePermission } from '@/hooks/use-permission'
import { useDashboardMetrics } from '@/queries/dashboard'
import { getApiErrorMessage } from '@/utils/api-error'
import { formatPercentValue } from '@/utils/number'

export function DashboardOverview() {
	const canReadAlerts = usePermission(EPermission.ALERT_READ)
	const {
		data: metrics,
		isLoading: isLoadingMetrics,
		error: metricsError,
		refetch: refetchMetrics,
	} = useDashboardMetrics()

	return (
		<>
			<PageHeader title="Visão geral" description="Indicadores da operação portuária." />
			{isLoadingMetrics && <LoadingState rows={3} />}
			{metricsError && <ErrorState message={getApiErrorMessage(metricsError)} onRetry={() => refetchMetrics()} />}
			{metrics && (
				<>
					<div className="grid gap-4 md:grid-cols-3">
						<KpiCard
							title="Eficiência de validação"
							value={formatPercentValue(metrics.efficiency_percent)}
							hint="Validações conformes"
							icon={BadgeCheck}
						/>
					</div>
					<DashboardPanel title="Volume de embarques">
						<VolumeTrendChart points={metrics.volume_trend} />
					</DashboardPanel>
				</>
			)}
			<div className="grid gap-4 lg:grid-cols-2">
				<RecentShipments />
				{canReadAlerts && <OpenAlerts />}
			</div>
		</>
	)
}
