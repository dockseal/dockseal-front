import { useNavigate } from '@tanstack/react-router'
import { BellOff } from 'lucide-react'

import type { TAlertStatus } from '@/@types/alert'
import type { TSeverity } from '@/@types/analysis'
import { AlertDetailSheet } from '@/components/alerts/alert-detail-sheet'
import { AlertsFilters } from '@/components/alerts/alerts-filters'
import { AlertsTable } from '@/components/alerts/alerts-table'
import { EmptyState } from '@/components/feedback/empty-state'
import { ErrorState } from '@/components/feedback/error-state'
import { LoadingState } from '@/components/feedback/loading-state'
import { PageHeader } from '@/components/page-header'
import { useAlerts } from '@/queries/alerts'
import { getApiErrorMessage } from '@/utils/api-error'

interface IAlertsCenterProps {
	status?: TAlertStatus
	severity?: TSeverity
	alertId?: string
}

export function AlertsCenter({ status, severity, alertId }: IAlertsCenterProps) {
	const navigate = useNavigate({ from: '/alertas' })

	const {
		data: alerts,
		isLoading: isLoadingAlerts,
		error: alertsError,
		refetch: refetchAlerts,
	} = useAlerts({ status, severity })
	const { data: allAlerts, isLoading: isLoadingAllAlerts } = useAlerts({})
	const selectedAlert = allAlerts?.find((alert) => alert.id === alertId)

	function handleStatusChange(nextStatus: TAlertStatus | undefined) {
		navigate({ search: (previous) => ({ ...previous, status: nextStatus }) })
	}

	function handleSeverityChange(nextSeverity: TSeverity | undefined) {
		navigate({ search: (previous) => ({ ...previous, severity: nextSeverity }) })
	}

	function handleOpenDetails(nextAlertId: string) {
		navigate({ search: (previous) => ({ ...previous, alertId: nextAlertId }) })
	}

	function handleCloseDetails() {
		navigate({ search: (previous) => ({ ...previous, alertId: undefined }) })
	}

	return (
		<>
			<PageHeader title="Central de alertas" description="Divergências encontradas nas validações com IA." />
			<AlertsFilters
				status={status}
				severity={severity}
				onStatusChange={handleStatusChange}
				onSeverityChange={handleSeverityChange}
			/>
			{isLoadingAlerts && <LoadingState rows={4} />}
			{alertsError && <ErrorState message={getApiErrorMessage(alertsError)} onRetry={() => refetchAlerts()} />}
			{alerts && alerts.length === 0 && <EmptyState icon={BellOff} title="Nenhum alerta encontrado." />}
			{alerts && alerts.length > 0 && <AlertsTable alerts={alerts} onOpenDetails={handleOpenDetails} />}
			<AlertDetailSheet
				alertId={alertId}
				alert={selectedAlert}
				isLoading={isLoadingAllAlerts}
				onClose={handleCloseDetails}
			/>
		</>
	)
}
