import { createFileRoute, Navigate, Outlet, redirect } from '@tanstack/react-router'

import { AppShell } from '@/components/app-shell/app-shell'
import { meQueryOptions } from '@/queries/auth'
import { useSessionStore } from '@/stores/session'

export const Route = createFileRoute('/_app')({
	beforeLoad: async ({ context }) => {
		if (!useSessionStore.getState().accessToken) {
			throw redirect({ to: '/login' })
		}

		try {
			await context.queryClient.ensureQueryData(meQueryOptions())
		} catch {
			if (!useSessionStore.getState().accessToken) {
				throw redirect({ to: '/login' })
			}
		}
	},
	component: AppRouteLayout,
})

function AppRouteLayout() {
	const accessToken = useSessionStore((state) => state.accessToken)

	if (!accessToken) {
		return <Navigate to="/login" />
	}

	return (
		<AppShell>
			<Outlet />
		</AppShell>
	)
}
