import { Link } from '@tanstack/react-router'

import type { IShipment } from '@/@types/shipment'
import { StatusBadge } from '@/components/feedback/status-badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { SHIPMENT_STATUS_LABEL, SHIPMENT_STATUS_TONE } from '@/constants/shipment'
import { formatContainerNumber } from '@/utils/container'
import { formatDate, formatDateTime } from '@/utils/date'
import { getShipmentLabel } from '@/utils/shipment'

interface IShipmentsTableProps {
	shipments: IShipment[]
}

export function ShipmentsTable({ shipments }: IShipmentsTableProps) {
	return (
		<div className="rounded-lg border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Identificador</TableHead>
						<TableHead>Origem</TableHead>
						<TableHead>Destino</TableHead>
						<TableHead>Contêiner</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Chegada prevista</TableHead>
						<TableHead>Criado em</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{shipments.map((shipment) => (
						<TableRow key={shipment.id}>
							<TableCell className="font-medium">
								<Link
									to="/shipments/$shipmentId"
									params={{ shipmentId: shipment.id }}
									className="underline-offset-4 hover:underline"
								>
									{getShipmentLabel(shipment)}
								</Link>
							</TableCell>
							<TableCell>{shipment.origin}</TableCell>
							<TableCell>{shipment.destination}</TableCell>
							<TableCell>
								{shipment.container ? formatContainerNumber(shipment.container.container_number) : '—'}
							</TableCell>
							<TableCell>
								<StatusBadge
									label={SHIPMENT_STATUS_LABEL[shipment.status]}
									tone={SHIPMENT_STATUS_TONE[shipment.status]}
								/>
							</TableCell>
							<TableCell>{formatDate(shipment.expected_arrival)}</TableCell>
							<TableCell>{formatDateTime(shipment.created_at)}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	)
}
