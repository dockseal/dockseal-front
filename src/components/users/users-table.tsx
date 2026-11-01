import type { IUser } from '@/@types/auth'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { USER_ROLE_LABEL } from '@/constants/auth'
import { useMe } from '@/queries/auth'

interface IUsersTableProps {
	users: IUser[]
	onEdit: (user: IUser) => void
	onDelete: (user: IUser) => void
}

export function UsersTable({ users, onEdit, onDelete }: IUsersTableProps) {
	const { data: me } = useMe()

	return (
		<div className="rounded-lg border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Nome</TableHead>
						<TableHead>E-mail</TableHead>
						<TableHead>Perfil</TableHead>
						<TableHead>Status</TableHead>
						<TableHead className="text-right">Ações</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{users.map((user) => (
						<TableRow key={user.id}>
							<TableCell className="font-medium">{user.name}</TableCell>
							<TableCell>{user.email}</TableCell>
							<TableCell>{USER_ROLE_LABEL[user.role.name]}</TableCell>
							<TableCell>{user.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}</TableCell>
							<TableCell className="text-right">
								<div className="flex justify-end gap-2">
									<Button type="button" variant="outline" size="sm" onClick={() => onEdit(user)}>
										Editar
									</Button>
									<Button
										type="button"
										variant="destructive"
										size="sm"
										disabled={user.id === me?.id}
										onClick={() => onDelete(user)}
									>
										Excluir
									</Button>
								</div>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	)
}
