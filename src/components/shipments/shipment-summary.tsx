import type { IShipmentDetail } from '@/@types/shipment'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatContainerNumber } from '@/utils/container'
import { formatDateTime } from '@/utils/date'

interface IShipmentSummaryProps {
	shipment: IShipmentDetail
}

export function ShipmentSummary({ shipment }: IShipmentSummaryProps) {
	const items = [
		{ label: 'Origem', value: shipment.origin },
		{ label: 'Destino', value: shipment.destination },
		{ label: 'Transportadora', value: shipment.transport_company ?? '—' },
		{
			label: 'Contêiner principal',
			value: shipment.container ? formatContainerNumber(shipment.container.container_number) : '—',
		},
		{ label: 'Despacho', value: formatDateTime(shipment.dispatched_at) },
		{ label: 'Chegada prevista', value: formatDateTime(shipment.expected_arrival) },
		{ label: 'Retorno previsto', value: formatDateTime(shipment.expected_return) },
		{ label: 'Retornado em', value: formatDateTime(shipment.returned_at) },
		{ label: 'Criado em', value: formatDateTime(shipment.created_at) },
		{ label: 'Documentos', value: String(shipment.documents.length) },
	]

	return (
		<Card>
			<CardHeader>
				<CardTitle>Resumo</CardTitle>
			</CardHeader>
			<CardContent>
				<dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{items.map((item) => (
						<div key={item.label}>
							<dt className="text-xs text-muted-foreground">{item.label}</dt>
							<dd className="font-medium">{item.value}</dd>
						</div>
					))}
				</dl>
			</CardContent>
		</Card>
	)
}
