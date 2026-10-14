import { Link } from '@tanstack/react-router'
import { CircleUser, LogOut, Settings } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { USER_ROLE_LABEL } from '@/constants/auth'
import { useLogout } from '@/hooks/use-logout'
import { useMe } from '@/queries/auth'

export function UserMenu() {
	const { data: me } = useMe()
	const logout = useLogout()

	function handleLogout() {
		logout()
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button type="button" variant="ghost" className="gap-2" aria-label="Menu do usuário">
					<CircleUser />
					<span className="hidden sm:inline">{me?.name}</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-56">
				<DropdownMenuLabel className="flex flex-col">
					<span>{me?.name}</span>
					<span className="text-xs font-normal text-muted-foreground">{me ? USER_ROLE_LABEL[me.role.name] : ''}</span>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild>
					<Link to="/configuracoes">
						<Settings />
						Configurações
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem onSelect={handleLogout}>
					<LogOut />
					Sair
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
