import type { ReactNode } from 'react'

import { AppHeader } from '@/components/app-shell/app-header'
import { AppSidebar } from '@/components/app-shell/app-sidebar'

interface IAppShellProps {
	children: ReactNode
}

export function AppShell({ children }: IAppShellProps) {
	return (
		<div className="flex h-dvh w-full overflow-hidden">
			<AppSidebar />
			<div className="flex min-h-0 min-w-0 flex-1 flex-col">
				<AppHeader />
				<main className="min-h-0 flex-1 overflow-y-auto p-4 md:p-8">
					<div className="mx-auto flex w-full max-w-6xl flex-col gap-6">{children}</div>
				</main>
			</div>
		</div>
	)
}
