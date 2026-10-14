import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { AuditLog } from '@/components/events/audit-log'
import { EPermission } from '@/constants/auth'
import { requireRoutePermission } from '@/utils/permission'

const auditSearchSchema = z.object({
	shipmentId: z.uuid().optional().catch(undefined),
})

export const Route = createFileRoute('/_app/auditoria')({
	validateSearch: auditSearchSchema,
	beforeLoad: ({ context }) => requireRoutePermission(context.queryClient, EPermission.HISTORY_READ),
	head: () => ({ meta: [{ title: 'Auditoria | Dockseal' }] }),
	component: AuditPage,
})

function AuditPage() {
	const { shipmentId } = Route.useSearch()

	return <AuditLog shipmentId={shipmentId} />
}
