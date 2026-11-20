import { Link } from '@tanstack/react-router'

import type { IAlert } from '@/@types/alert'
import { StatusBadge } from '@/components/feedback/status-badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ALERT_STATUS_LABEL, SEVERITY_LABEL, SEVERITY_TONE } from '@/constants/alert'
import { splitAlertDescription } from '@/utils/alert'
import { formatDateTime } from '@/utils/date'

interface IAlertsTableProps {
	alerts: IAlert[]
	onOpenDetails: (alertId: string) => void
}

export function AlertsTable({ alerts, onOpenDetails }: IAlertsTableProps) {
	return (
		<div className="rounded-lg border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Severidade</TableHead>
						<TableHead>Descrição</TableHead>
						<TableHead>Embarque</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Criado em</TableHead>
						<TableHead>
							<span className="sr-only">Ações</span>
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{alerts.map((alert) => {
						const { field, text } = splitAlertDescription(alert.description)

						return (
							<TableRow key={alert.id}>
								<TableCell>
									<StatusBadge label={SEVERITY_LABEL[alert.severity]} tone={SEVERITY_TONE[alert.severity]} />
								</TableCell>
								<TableCell className="max-w-md whitespace-normal">
									{field && <span className="font-medium capitalize">{field}: </span>}
									{text}
								</TableCell>
								<TableCell>
									{alert.shipment_id ? (
										<Link
											to="/shipments/$shipmentId"
											params={{ shipmentId: alert.shipment_id }}
											className="font-mono underline-offset-4 hover:underline"
										>
											{alert.shipment_id.slice(0, 8)}
										</Link>
									) : (
										'—'
									)}
								</TableCell>
								<TableCell>{ALERT_STATUS_LABEL[alert.status]}</TableCell>
								<TableCell>{formatDateTime(alert.created_at)}</TableCell>
								<TableCell>
									<Button type="button" variant="outline" size="sm" onClick={() => onOpenDetails(alert.id)}>
										Detalhes
									</Button>
								</TableCell>
							</TableRow>
						)
					})}
				</TableBody>
			</Table>
		</div>
	)
}
