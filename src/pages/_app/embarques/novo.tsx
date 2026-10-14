import { createFileRoute } from '@tanstack/react-router'

import { PageHeader } from '@/components/page-header'
import { ShipmentForm } from '@/components/shipments/shipment-form'
import { EPermission } from '@/constants/auth'
import { requireRoutePermission } from '@/utils/permission'

export const Route = createFileRoute('/_app/embarques/novo')({
	beforeLoad: ({ context }) => requireRoutePermission(context.queryClient, EPermission.SHIPMENT_WRITE),
	head: () => ({ meta: [{ title: 'Novo embarque | Dockseal' }] }),
	component: NewShipmentPage,
})

function NewShipmentPage() {
	return (
		<>
			<PageHeader title="Novo embarque" description="Registre um embarque e, se quiser, o contêiner principal." />
			<ShipmentForm />
		</>
	)
}
