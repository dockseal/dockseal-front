import { Link } from '@tanstack/react-router'

import { APP_NAV_ITEMS } from '@/constants/navigation'
import { useMe } from '@/queries/auth'
import { hasPermission } from '@/utils/permission'

interface IAppNavProps {
	onNavigate?: () => void
}

export function AppNav({ onNavigate }: IAppNavProps) {
	const { data: me } = useMe()
	const items = APP_NAV_ITEMS.filter((item) => item.permission === null || hasPermission(me, item.permission))

	return (
		<nav aria-label="Navegação principal" className="flex flex-col gap-1">
			{items.map(({ label, to, icon: Icon }) => (
				<Link
					key={to}
					to={to}
					onClick={onNavigate}
					className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
					activeProps={{ className: 'bg-accent text-accent-foreground font-medium', 'aria-current': 'page' }}
				>
					<Icon className="size-4" aria-hidden="true" />
					{label}
				</Link>
			))}
		</nav>
	)
}
