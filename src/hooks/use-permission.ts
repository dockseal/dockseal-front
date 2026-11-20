import type { TPermission } from '@/@types/auth'
import { useMe } from '@/queries/auth'
import { hasPermission } from '@/utils/permission'

export function usePermission(permission: TPermission) {
	const { data: me } = useMe()

	return hasPermission(me, permission)
}
