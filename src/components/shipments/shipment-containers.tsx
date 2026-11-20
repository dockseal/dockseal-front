import { Container } from 'lucide-react'

import type { IShipmentDetail } from '@/@types/shipment'
import { EmptyState } from '@/components/feedback/empty-state'
import { StatusBadge } from '@/components/feedback/status-badge'
import { ContainerForm } from '@/components/shipments/container-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EPermission } from '@/constants/auth'
import { CONTAINER_STATUS_LABEL } from '@/constants/shipment'
import { usePermission } from '@/hooks/use-permission'
import { formatContainerNumber } from '@/utils/container'

interface IShipmentContainersProps {
	shipment: IShipmentDetail
}

export function ShipmentContainers({ shipment }: IShipmentContainersProps) {
	const canWrite = usePermission(EPermission.SHIPMENT_WRITE)

	return (
		<div className="flex flex-col gap-6">
			<Card>
				<CardHeader>
					<CardTitle>Contêineres</CardTitle>
				</CardHeader>
				<CardContent>
					{shipment.containers.length === 0 ? (
						<EmptyState icon={Container} title="Nenhum contêiner associado." />
					) : (
						<ul className="flex flex-col divide-y">
							{shipment.containers.map((container) => (
								<li key={container.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
									<div className="flex flex-col">
										<span className="font-mono font-medium">{formatContainerNumber(container.container_number)}</span>
										<span className="text-xs text-muted-foreground">
											{[container.iso_code, container.type, container.owner].filter(Boolean).join(' · ') || '—'}
										</span>
									</div>
									<div className="flex items-center gap-2">
										{shipment.container?.id === container.id && <StatusBadge label="Principal" tone="info" />}
										<StatusBadge label={CONTAINER_STATUS_LABEL[container.status] ?? container.status} tone="neutral" />
									</div>
								</li>
							))}
						</ul>
					)}
				</CardContent>
			</Card>
			{canWrite && <ContainerForm shipmentId={shipment.id} hasPrimary={shipment.container !== null} />}
		</div>
	)
}
