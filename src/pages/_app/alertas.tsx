import { createFileRoute, redirect } from '@tanstack/react-router'
import { z } from 'zod'

const alertsSearchSchema = z.object({
	status: z.enum(['OPEN', 'RESOLVED', 'CLOSED', 'DISMISSED']).optional().catch(undefined),
	severity: z.enum(['BAIXA', 'MEDIA', 'ALTA', 'CRITICA']).optional().catch(undefined),
	alertId: z.uuid().optional().catch(undefined),
})

export const Route = createFileRoute('/_app/alertas')({
	validateSearch: alertsSearchSchema,
	beforeLoad: ({ search }) => {
		throw redirect({ to: '/alerts', search })
	},
})
