import { createFileRoute } from '@tanstack/react-router'

import { DashboardOverview } from '@/components/dashboard/dashboard-overview'
import { EPermission } from '@/constants/auth'
import { requireRoutePermission } from '@/utils/permission'

export const Route = createFileRoute('/_app/dashboard')({
	beforeLoad: ({ context }) => requireRoutePermission(context.queryClient, EPermission.SHIPMENT_READ),
	head: () => ({ meta: [{ title: 'Visão geral | Dockseal' }] }),
	component: DashboardPage,
})

function DashboardPage() {
	return <DashboardOverview />
}
