import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { ShipmentsList } from '@/components/shipments/shipments-list'
import { EPermission } from '@/constants/auth'
import { requireRoutePermission } from '@/utils/permission'

const shipmentsSearchSchema = z.object({
	page: z.number().int().min(1).optional().catch(undefined),
})

export const Route = createFileRoute('/_app/shipments/')({
	validateSearch: shipmentsSearchSchema,
	beforeLoad: ({ context }) => requireRoutePermission(context.queryClient, EPermission.SHIPMENT_READ),
	head: () => ({ meta: [{ title: 'Embarques | Dockseal' }] }),
	component: ShipmentsPage,
})

function ShipmentsPage() {
	const { page } = Route.useSearch()

	return <ShipmentsList page={page ?? 1} />
}
