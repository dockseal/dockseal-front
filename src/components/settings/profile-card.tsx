import { LogOut } from 'lucide-react'

import type { IUser } from '@/@types/auth'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PERMISSION_LABEL, USER_ROLE_LABEL } from '@/constants/auth'
import { useLogout } from '@/hooks/use-logout'

interface IProfileCardProps {
	user: IUser
}

export function ProfileCard({ user }: IProfileCardProps) {
	const logout = useLogout()

	function handleLogout() {
		logout()
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Perfil</CardTitle>
				<CardDescription>Dados da sua conta na plataforma.</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col gap-4">
				<dl className="grid gap-3 sm:grid-cols-3">
					<div>
						<dt className="text-xs text-muted-foreground">Nome</dt>
						<dd className="font-medium">{user.name}</dd>
					</div>
					<div>
						<dt className="text-xs text-muted-foreground">E-mail</dt>
						<dd className="font-medium">{user.email}</dd>
					</div>
					<div>
						<dt className="text-xs text-muted-foreground">Perfil</dt>
						<dd className="font-medium">{USER_ROLE_LABEL[user.role.name]}</dd>
					</div>
				</dl>
				<div className="flex flex-col gap-2">
					<span className="text-xs text-muted-foreground">Permissões</span>
					<ul className="flex flex-wrap gap-2">
						{user.permissions.map((permission) => (
							<li key={permission}>
								<Badge variant="secondary">{PERMISSION_LABEL[permission] ?? permission}</Badge>
							</li>
						))}
					</ul>
				</div>
				<div>
					<Button type="button" variant="outline" onClick={handleLogout}>
						<LogOut />
						Sair
					</Button>
				</div>
			</CardContent>
		</Card>
	)
}
