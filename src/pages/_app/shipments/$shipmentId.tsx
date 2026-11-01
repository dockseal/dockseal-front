import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { ShipmentDetail } from '@/components/shipments/shipment-detail'
import { EPermission } from '@/constants/auth'
import { SHIPMENT_DETAIL_TAB_FROM_LEGACY } from '@/constants/shipment'
import { useShipmentDetailTabs } from '@/hooks/use-shipment-detail-tabs'
import { requireAnyRoutePermission } from '@/utils/permission'

const shipmentDetailSearchSchema = z.object({
	tab: z
		.string()
		.optional()
		.catch(undefined)
		.transform((value) => {
			if (!value) return undefined

			const tab = SHIPMENT_DETAIL_TAB_FROM_LEGACY[value]

			return tab === 'summary' ? undefined : tab
		}),
})

export const Route = createFileRoute('/_app/shipments/$shipmentId')({
	validateSearch: shipmentDetailSearchSchema,
	beforeLoad: ({ context }) =>
		requireAnyRoutePermission(context.queryClient, [EPermission.SHIPMENT_READ, EPermission.SHIPMENT_WRITE]),
	head: () => ({ meta: [{ title: 'Embarque | Dockseal' }] }),
	component: ShipmentDetailPage,
})

function ShipmentDetailPage() {
	const { shipmentId } = Route.useParams()
	const { tab } = Route.useSearch()
	const { tabs, activeTab } = useShipmentDetailTabs(tab)

	return <ShipmentDetail shipmentId={shipmentId} tab={activeTab} tabs={tabs} />
}
