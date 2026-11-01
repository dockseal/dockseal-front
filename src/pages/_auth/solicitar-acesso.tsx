import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/solicitar-acesso')({
	beforeLoad: () => {
		throw redirect({ to: '/request-access' })
	},
})
