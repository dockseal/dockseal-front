import type { QueryClient } from '@tanstack/react-query'
import { redirect } from '@tanstack/react-router'

import type { IUser, TPermission, TUserRole } from '@/@types/auth'
import { ROLE_PERMISSIONS } from '@/constants/auth'
import { meQueryOptions } from '@/queries/auth'
import { getLandingPath } from '@/utils/navigation'

export function effectivePermissions(user: IUser | null | undefined) {
	if (!user) return []

	const role = user.role.name as TUserRole
	const allowed = ROLE_PERMISSIONS[role]

	if (!allowed) return []

	return user.permissions.filter((permission) => allowed.includes(permission))
}

export function hasPermission(user: IUser | null | undefined, permission: TPermission) {
	return effectivePermissions(user).includes(permission)
}

export async function requireRoutePermission(queryClient: QueryClient, permission: TPermission) {
	const user = await queryClient.ensureQueryData(meQueryOptions())

	if (!hasPermission(user, permission)) {
		throw redirect({ to: getLandingPath(user.role.name) })
	}

	return user
}

export async function requireAnyRoutePermission(queryClient: QueryClient, permissions: TPermission[]) {
	const user = await queryClient.ensureQueryData(meQueryOptions())

	if (!permissions.some((permission) => hasPermission(user, permission))) {
		throw redirect({ to: getLandingPath(user.role.name) })
	}

	return user
}
