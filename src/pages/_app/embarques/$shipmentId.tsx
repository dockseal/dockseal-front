import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { ShipmentDetail } from '@/components/shipments/shipment-detail'
import { EPermission } from '@/constants/auth'
import { useShipmentDetailTabs } from '@/hooks/use-shipment-detail-tabs'
import { requireRoutePermission } from '@/utils/permission'

const shipmentDetailSearchSchema = z.object({
	tab: z.enum(['resumo', 'conteineres', 'documentos', 'validacao', 'historico']).optional().catch(undefined),
})

export const Route = createFileRoute('/_app/embarques/$shipmentId')({
	validateSearch: shipmentDetailSearchSchema,
	beforeLoad: ({ context }) => requireRoutePermission(context.queryClient, EPermission.SHIPMENT_READ),
	head: () => ({ meta: [{ title: 'Embarque | Dockseal' }] }),
	component: ShipmentDetailPage,
})

function ShipmentDetailPage() {
	const { shipmentId } = Route.useParams()
	const { tab } = Route.useSearch()
	const { tabs, activeTab } = useShipmentDetailTabs(tab)

	return <ShipmentDetail shipmentId={shipmentId} tab={activeTab} tabs={tabs} />
}
