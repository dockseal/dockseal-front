import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

import type { TShipmentDetailTab } from '@/@types/shipment'
import { ErrorState } from '@/components/feedback/error-state'
import { LoadingState } from '@/components/feedback/loading-state'
import { StatusBadge } from '@/components/feedback/status-badge'
import { PageHeader } from '@/components/page-header'
import { ShipmentDetailTabs } from '@/components/shipments/shipment-detail-tabs'
import { Button } from '@/components/ui/button'
import { SHIPMENT_STATUS_LABEL, SHIPMENT_STATUS_TONE } from '@/constants/shipment'
import { useShipment } from '@/queries/shipments'
import { getApiErrorMessage, getApiErrorStatus } from '@/utils/api-error'
import { getShipmentLabel } from '@/utils/shipment'

interface IShipmentDetailProps {
	shipmentId: string
	tab: TShipmentDetailTab
	tabs: TShipmentDetailTab[]
}

function BackToShipmentsLink() {
	return (
		<Button asChild variant="outline" size="sm">
			<Link to="/embarques">
				<ArrowLeft />
				Voltar para embarques
			</Link>
		</Button>
	)
}

export function ShipmentDetail({ shipmentId, tab, tabs }: IShipmentDetailProps) {
	const {
		data: shipment,
		isLoading: isLoadingShipment,
		error: shipmentError,
		refetch: refetchShipment,
	} = useShipment(shipmentId)

	if (isLoadingShipment) return <LoadingState rows={5} />

	if (shipmentError || !shipment) {
		const isNotFound = getApiErrorStatus(shipmentError) === 404

		return (
			<ErrorState
				title={isNotFound ? 'Embarque não encontrado' : 'Não foi possível carregar'}
				message={
					isNotFound ? 'Verifique o endereço ou volte para a lista de embarques.' : getApiErrorMessage(shipmentError)
				}
				onRetry={isNotFound ? undefined : () => refetchShipment()}
			>
				<BackToShipmentsLink />
			</ErrorState>
		)
	}

	return (
		<>
			<PageHeader
				title={getShipmentLabel(shipment)}
				description={`${shipment.origin} → ${shipment.destination}`}
				actions={
					<StatusBadge label={SHIPMENT_STATUS_LABEL[shipment.status]} tone={SHIPMENT_STATUS_TONE[shipment.status]} />
				}
			/>
			<ShipmentDetailTabs shipment={shipment} tab={tab} tabs={tabs} />
		</>
	)
}
