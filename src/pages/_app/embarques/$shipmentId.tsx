import { createFileRoute, redirect } from '@tanstack/react-router'
import { z } from 'zod'

import { SHIPMENT_DETAIL_TAB_FROM_LEGACY } from '@/constants/shipment'

const legacyShipmentSearchSchema = z.object({
	tab: z.string().optional().catch(undefined),
})

export const Route = createFileRoute('/_app/embarques/$shipmentId')({
	validateSearch: legacyShipmentSearchSchema,
	beforeLoad: ({ params, search }) => {
		const tab = search.tab ? SHIPMENT_DETAIL_TAB_FROM_LEGACY[search.tab] : undefined

		throw redirect({
			to: '/shipments/$shipmentId',
			params: { shipmentId: params.shipmentId },
			search: { tab: !tab || tab === 'summary' ? undefined : tab },
		})
	},
})
