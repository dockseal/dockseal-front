import { createRootRouteWithContext, HeadContent, Outlet } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'

import type { IRouterContext } from '@/@types/router'
import { env } from '@/env'

const isDevtoolsEnabled = import.meta.env.DEV && env.VITE_ENABLE_DEVTOOLS

const TanStackRouterDevtools = isDevtoolsEnabled
	? lazy(() => import('@tanstack/react-router-devtools').then((mod) => ({ default: mod.TanStackRouterDevtools })))
	: () => null
const ReactQueryDevtools = isDevtoolsEnabled
	? lazy(() => import('@tanstack/react-query-devtools').then((mod) => ({ default: mod.ReactQueryDevtools })))
	: () => null

export const Route = createRootRouteWithContext<IRouterContext>()({
	component: RootComponent,
})

function RootComponent() {
	return (
		<>
			<HeadContent />
			<Outlet />
			{isDevtoolsEnabled && (
				<Suspense fallback={null}>
					<TanStackRouterDevtools />
					<ReactQueryDevtools />
				</Suspense>
			)}
		</>
	)
}
