import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/embarques/novo')({
	beforeLoad: () => {
		throw redirect({ to: '/shipments/new' })
	},
})
