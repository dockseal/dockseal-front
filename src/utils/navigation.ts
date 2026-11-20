import type { TUserRole } from '@/@types/auth'

export function getLandingPath(role: TUserRole | null | undefined) {
	return role === 'OPERADOR' ? '/shipments/new' : '/dashboard'
}
