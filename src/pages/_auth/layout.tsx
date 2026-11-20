import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

import { AuthLayout } from '@/components/auth/auth-layout'
import { useSessionStore } from '@/stores/session'
import { getLandingPath } from '@/utils/navigation'

export const Route = createFileRoute('/_auth')({
	beforeLoad: () => {
		const { accessToken, role } = useSessionStore.getState()

		if (accessToken) {
			throw redirect({ to: getLandingPath(role) })
		}
	},
	component: AuthRouteLayout,
})

function AuthRouteLayout() {
	return (
		<AuthLayout>
			<Outlet />
		</AuthLayout>
	)
}
