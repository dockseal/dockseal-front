import { createFileRoute, redirect } from '@tanstack/react-router'
import { z } from 'zod'

const shipmentsSearchSchema = z.object({
	page: z.number().int().min(1).optional().catch(undefined),
})

export const Route = createFileRoute('/_app/embarques/')({
	validateSearch: shipmentsSearchSchema,
	beforeLoad: ({ search }) => {
		throw redirect({ to: '/shipments', search })
	},
})
