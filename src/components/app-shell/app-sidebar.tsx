import { Link } from '@tanstack/react-router'

import { AppNav } from '@/components/app-shell/app-nav'

export function AppSidebar() {
	return (
		<aside className="hidden w-60 shrink-0 flex-col gap-6 border-r bg-sidebar p-4 md:flex">
			<Link to="/" className="px-3 font-display text-2xl">
				dockseal
			</Link>
			<AppNav />
		</aside>
	)
}
