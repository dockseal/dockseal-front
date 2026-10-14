import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { AlertsCenter } from '@/components/alerts/alerts-center'
import { EPermission } from '@/constants/auth'
import { requireRoutePermission } from '@/utils/permission'

const alertsSearchSchema = z.object({
	status: z.enum(['OPEN', 'RESOLVED', 'CLOSED', 'DISMISSED']).optional().catch(undefined),
	severity: z.enum(['BAIXA', 'MEDIA', 'ALTA', 'CRITICA']).optional().catch(undefined),
	alertId: z.uuid().optional().catch(undefined),
})

export const Route = createFileRoute('/_app/alertas')({
	validateSearch: alertsSearchSchema,
	beforeLoad: ({ context }) => requireRoutePermission(context.queryClient, EPermission.ALERT_READ),
	head: () => ({ meta: [{ title: 'Central de alertas | Dockseal' }] }),
	component: AlertsPage,
})

function AlertsPage() {
	const { status, severity, alertId } = Route.useSearch()

	return <AlertsCenter status={status} severity={severity} alertId={alertId} />
}
