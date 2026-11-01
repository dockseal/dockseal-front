import { createFileRoute, redirect } from '@tanstack/react-router'
import { z } from 'zod'

const auditSearchSchema = z.object({
	shipmentId: z.uuid().optional().catch(undefined),
})

export const Route = createFileRoute('/_app/auditoria')({
	validateSearch: auditSearchSchema,
	beforeLoad: ({ search }) => {
		throw redirect({ to: '/audit', search })
	},
})
