import { QueryClientProvider } from '@tanstack/react-query'
import { createRouter, RouterProvider } from '@tanstack/react-router'

import { RouteError } from '@/components/feedback/route-error'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { queryClient } from '@/lib/query-client'
import { routeTree } from '@/route-tree.gen'

const router = createRouter({ routeTree, context: { queryClient }, defaultErrorComponent: RouteError })

declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router
	}
}

export function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider defaultTheme="dark">
				<TooltipProvider>
					<RouterProvider router={router} />
					<Toaster richColors closeButton />
				</TooltipProvider>
			</ThemeProvider>
		</QueryClientProvider>
	)
}
