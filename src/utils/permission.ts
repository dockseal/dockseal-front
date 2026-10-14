import type { QueryClient } from '@tanstack/react-query'
import { redirect } from '@tanstack/react-router'

import type { IUser, TPermission } from '@/@types/auth'
import { meQueryOptions } from '@/queries/auth'
import { getLandingPath } from '@/utils/navigation'

export function hasPermission(user: IUser | null | undefined, permission: TPermission) {
	return user?.permissions.includes(permission) ?? false
}

export async function requireRoutePermission(queryClient: QueryClient, permission: TPermission) {
	const user = await queryClient.ensureQueryData(meQueryOptions())

	if (!hasPermission(user, permission)) {
		throw redirect({ to: getLandingPath(user.role.name) })
	}

	return user
}
