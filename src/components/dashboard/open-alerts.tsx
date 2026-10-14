import { Link } from '@tanstack/react-router'

import { DashboardPanel } from '@/components/dashboard/dashboard-panel'
import { ErrorState } from '@/components/feedback/error-state'
import { LoadingState } from '@/components/feedback/loading-state'
import { StatusBadge } from '@/components/feedback/status-badge'
import { SEVERITY_LABEL, SEVERITY_TONE } from '@/constants/alert'
import { DASHBOARD_OPEN_ALERTS } from '@/constants/api'
import { useAlerts } from '@/queries/alerts'
import { splitAlertDescription } from '@/utils/alert'
import { getApiErrorMessage } from '@/utils/api-error'

export function OpenAlerts() {
	const { data: openAlerts, isLoading: isLoadingOpenAlerts, error: openAlertsError } = useAlerts({ status: 'OPEN' })
	const visibleAlerts = openAlerts?.slice(0, DASHBOARD_OPEN_ALERTS)

	return (
		<DashboardPanel title="Alertas abertos">
			{isLoadingOpenAlerts && <LoadingState />}
			{openAlertsError && <ErrorState message={getApiErrorMessage(openAlertsError)} />}
			{visibleAlerts && visibleAlerts.length === 0 && (
				<p className="text-sm text-muted-foreground">Nenhum alerta aberto.</p>
			)}
			{visibleAlerts && visibleAlerts.length > 0 && (
				<ul className="flex flex-col divide-y">
					{visibleAlerts.map((alert) => {
						const { field, text } = splitAlertDescription(alert.description)

						return (
							<li key={alert.id} className="flex items-center justify-between gap-3 py-2">
								<Link
									to="/alertas"
									search={{ alertId: alert.id }}
									className="line-clamp-2 text-sm underline-offset-4 hover:underline"
								>
									<span className="font-medium capitalize">{field || 'Alerta'}</span>
									{text && <span className="text-muted-foreground"> — {text}</span>}
								</Link>
								<StatusBadge label={SEVERITY_LABEL[alert.severity]} tone={SEVERITY_TONE[alert.severity]} />
							</li>
						)
					})}
				</ul>
			)}
		</DashboardPanel>
	)
}
