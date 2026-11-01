import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { UsersList } from '@/components/users/users-list'
import { EPermission } from '@/constants/auth'
import { requireRoutePermission } from '@/utils/permission'

const usersSearchSchema = z.object({
	page: z.number().int().min(1).optional().catch(undefined),
})

export const Route = createFileRoute('/_app/users/')({
	validateSearch: usersSearchSchema,
	beforeLoad: ({ context }) => requireRoutePermission(context.queryClient, EPermission.USER_MANAGE),
	head: () => ({ meta: [{ title: 'Usuários | Dockseal' }] }),
	component: UsersPage,
})

function UsersPage() {
	const { page } = Route.useSearch()

	return <UsersList page={page ?? 1} />
}
