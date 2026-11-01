import { Link } from '@tanstack/react-router'

import { DashboardPanel } from '@/components/dashboard/dashboard-panel'
import { ErrorState } from '@/components/feedback/error-state'
import { LoadingState } from '@/components/feedback/loading-state'
import { StatusBadge } from '@/components/feedback/status-badge'
import { DASHBOARD_RECENT_SHIPMENTS } from '@/constants/api'
import { SHIPMENT_STATUS_LABEL, SHIPMENT_STATUS_TONE } from '@/constants/shipment'
import { useShipments } from '@/queries/shipments'
import { getApiErrorMessage } from '@/utils/api-error'
import { formatDateTime } from '@/utils/date'
import { getShipmentLabel } from '@/utils/shipment'

export function RecentShipments() {
	const {
		data: shipments,
		isLoading: isLoadingShipments,
		error: shipmentsError,
	} = useShipments({ limit: DASHBOARD_RECENT_SHIPMENTS, offset: 0 })

	return (
		<DashboardPanel title="Embarques recentes">
			{isLoadingShipments && <LoadingState />}
			{shipmentsError && <ErrorState message={getApiErrorMessage(shipmentsError)} />}
			{shipments && shipments.length === 0 && (
				<p className="text-sm text-muted-foreground">Nenhum embarque registrado.</p>
			)}
			{shipments && shipments.length > 0 && (
				<ul className="flex flex-col divide-y">
					{shipments.map((shipment) => (
						<li key={shipment.id} className="flex items-center justify-between gap-3 py-2">
							<div className="flex flex-col">
								<Link
									to="/shipments/$shipmentId"
									params={{ shipmentId: shipment.id }}
									className="font-medium underline-offset-4 hover:underline"
								>
									{getShipmentLabel(shipment)}
								</Link>
								<span className="text-xs text-muted-foreground">{formatDateTime(shipment.created_at)}</span>
							</div>
							<StatusBadge
								label={SHIPMENT_STATUS_LABEL[shipment.status]}
								tone={SHIPMENT_STATUS_TONE[shipment.status]}
							/>
						</li>
					))}
				</ul>
			)}
		</DashboardPanel>
	)
}
