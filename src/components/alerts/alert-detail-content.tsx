import { Link } from '@tanstack/react-router'

import type { IAlert } from '@/@types/alert'
import { AlertActionsForm } from '@/components/alerts/alert-actions-form'
import { OccurrencesTable } from '@/components/analysis/occurrences-table'
import { StatusBadge } from '@/components/feedback/status-badge'
import { SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { ALERT_STATUS_LABEL, SEVERITY_LABEL, SEVERITY_TONE } from '@/constants/alert'
import { EPermission } from '@/constants/auth'
import { usePermission } from '@/hooks/use-permission'
import { useShipmentValidations } from '@/queries/shipment-validations'
import { findAlertDivergence, splitAlertDescription } from '@/utils/alert'
import { formatDateTime } from '@/utils/date'

interface IAlertDetailContentProps {
	alert: IAlert
}

export function AlertDetailContent({ alert }: IAlertDetailContentProps) {
	const canManage = usePermission(EPermission.ALERT_MANAGE)
	const canReadShipments = usePermission(EPermission.SHIPMENT_READ)
	const { data: validations } = useShipmentValidations(alert.shipment_id ?? '', {
		enabled: Boolean(alert.shipment_id),
	})
	const validation = validations?.find((candidate) => candidate.id === alert.validation_id)
	const divergence = findAlertDivergence(alert, validation)
	const { field, text, suggestion } = splitAlertDescription(alert.description)

	return (
		<div className="flex flex-col gap-5 overflow-y-auto p-4">
			<SheetHeader className="p-0">
				<div className="flex flex-wrap items-center gap-2">
					<StatusBadge label={SEVERITY_LABEL[alert.severity]} tone={SEVERITY_TONE[alert.severity]} />
					<StatusBadge label={ALERT_STATUS_LABEL[alert.status]} tone="neutral" />
				</div>
				<SheetTitle className="capitalize">{field || 'Alerta'}</SheetTitle>
				<SheetDescription>Criado em {formatDateTime(alert.created_at)}</SheetDescription>
			</SheetHeader>

			<div className="flex flex-col gap-2 text-sm">
				<p>{divergence?.description ?? text}</p>
				{(divergence?.suggestion ?? suggestion) && (
					<p>
						<span className="font-medium">Sugestão:</span> {divergence?.suggestion ?? suggestion}
					</p>
				)}
				{divergence && (
					<p className="text-muted-foreground">
						{divergence.document_to_fix ? `Corrigir em: ${divergence.document_to_fix}` : 'Requer conferência humana'}
					</p>
				)}
			</div>

			{divergence && divergence.occurrences.length > 0 && <OccurrencesTable occurrences={divergence.occurrences} />}

			{alert.resolution_note && (
				<div className="flex flex-col gap-1 rounded-lg border bg-muted/40 p-3 text-sm">
					<span className="text-xs text-muted-foreground">Nota atual</span>
					<p>{alert.resolution_note}</p>
				</div>
			)}

			{alert.shipment_id && canReadShipments && (
				<Link
					to="/shipments/$shipmentId"
					params={{ shipmentId: alert.shipment_id }}
					search={{ tab: 'validation' }}
					className="text-sm underline underline-offset-4"
				>
					Ver embarque
				</Link>
			)}

			{canManage && <AlertActionsForm key={`${alert.id}-${alert.status}`} alert={alert} />}
		</div>
	)
}
