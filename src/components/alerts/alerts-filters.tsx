import type { TAlertStatus } from '@/@types/alert'
import type { TSeverity } from '@/@types/analysis'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ALERT_STATUS_LABEL, ALERT_STATUSES, SEVERITY_LABEL, SEVERITY_ORDER } from '@/constants/alert'

const ALL_OPTION = 'all'

interface IAlertsFiltersProps {
	status?: TAlertStatus
	severity?: TSeverity
	onStatusChange: (status: TAlertStatus | undefined) => void
	onSeverityChange: (severity: TSeverity | undefined) => void
}

export function AlertsFilters({ status, severity, onStatusChange, onSeverityChange }: IAlertsFiltersProps) {
	function handleStatusChange(value: string) {
		onStatusChange(value === ALL_OPTION ? undefined : (value as TAlertStatus))
	}

	function handleSeverityChange(value: string) {
		onSeverityChange(value === ALL_OPTION ? undefined : (value as TSeverity))
	}

	return (
		<div className="flex flex-wrap gap-3">
			<Select value={status ?? ALL_OPTION} onValueChange={handleStatusChange}>
				<SelectTrigger className="w-48" aria-label="Status">
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value={ALL_OPTION}>Todos os status</SelectItem>
					{ALERT_STATUSES.map((item) => (
						<SelectItem key={item} value={item}>
							{ALERT_STATUS_LABEL[item]}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			<Select value={severity ?? ALL_OPTION} onValueChange={handleSeverityChange}>
				<SelectTrigger className="w-48" aria-label="Severidade">
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value={ALL_OPTION}>Todas as severidades</SelectItem>
					{SEVERITY_ORDER.map((item) => (
						<SelectItem key={item} value={item}>
							{SEVERITY_LABEL[item]}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	)
}
