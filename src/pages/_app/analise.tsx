import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/analise')({
	beforeLoad: () => {
		throw redirect({ to: '/analysis' })
	},
})
