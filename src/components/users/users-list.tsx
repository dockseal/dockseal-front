import { useNavigate } from '@tanstack/react-router'
import { Plus, Users } from 'lucide-react'
import { useState } from 'react'

import type { IUser } from '@/@types/auth'
import { EmptyState } from '@/components/feedback/empty-state'
import { ErrorState } from '@/components/feedback/error-state'
import { LoadingState } from '@/components/feedback/loading-state'
import { PageHeader } from '@/components/page-header'
import { ShipmentsPagination } from '@/components/shipments/shipments-pagination'
import { Button } from '@/components/ui/button'
import { DeleteUserSheet } from '@/components/users/delete-user-sheet'
import { UserFormSheet } from '@/components/users/user-form-sheet'
import { UsersTable } from '@/components/users/users-table'
import { USERS_PAGE_SIZE } from '@/constants/api'
import { useUsers } from '@/queries/users'
import { getApiErrorMessage } from '@/utils/api-error'
import { hasNextPage, pageToOffset } from '@/utils/pagination'

interface IUsersListProps {
	page: number
}

export function UsersList({ page }: IUsersListProps) {
	const navigate = useNavigate()
	const [formOpen, setFormOpen] = useState(false)
	const [editingUser, setEditingUser] = useState<IUser>()
	const [deletingUser, setDeletingUser] = useState<IUser>()
	const filters = { limit: USERS_PAGE_SIZE, offset: pageToOffset(page, USERS_PAGE_SIZE) }
	const {
		data: users,
		isLoading: isLoadingUsers,
		isFetching: isFetchingUsers,
		error: usersError,
		refetch: refetchUsers,
	} = useUsers(filters)

	function handlePageChange(nextPage: number) {
		navigate({ to: '/users', search: { page: nextPage > 1 ? nextPage : undefined } })
	}

	function handleCreate() {
		setEditingUser(undefined)
		setFormOpen(true)
	}

	function handleEdit(user: IUser) {
		setEditingUser(user)
		setFormOpen(true)
	}

	function handleFormOpenChange(open: boolean) {
		setFormOpen(open)

		if (!open) setEditingUser(undefined)
	}

	function handleDeleteOpenChange(open: boolean) {
		if (!open) setDeletingUser(undefined)
	}

	return (
		<>
			<PageHeader
				title="Usuários"
				description="Contas com acesso à plataforma."
				actions={
					<Button type="button" onClick={handleCreate}>
						<Plus />
						Novo usuário
					</Button>
				}
			/>
			{isLoadingUsers && <LoadingState rows={6} />}
			{usersError && !users && <ErrorState message={getApiErrorMessage(usersError)} onRetry={() => refetchUsers()} />}
			{users && users.length === 0 && page === 1 && <EmptyState icon={Users} title="Nenhum usuário cadastrado." />}
			{users && (users.length > 0 || page > 1) && (
				<>
					<UsersTable users={users} onEdit={handleEdit} onDelete={setDeletingUser} />
					<ShipmentsPagination
						page={page}
						hasNext={hasNextPage(users, USERS_PAGE_SIZE)}
						isFetching={isFetchingUsers}
						onPageChange={handlePageChange}
					/>
				</>
			)}
			<UserFormSheet open={formOpen} user={editingUser} onOpenChange={handleFormOpenChange} />
			<DeleteUserSheet user={deletingUser} onOpenChange={handleDeleteOpenChange} />
		</>
	)
}
