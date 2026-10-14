import { HttpResponse } from 'msw'

import type { IUser, TPermission, TUserRole } from '@/@types/auth'
import { getDb } from '@/api/mocks/db'
import { env } from '@/env'

export function apiUrl(path: string) {
	return `${env.VITE_API_URL}${path}`
}

export function detailResponse(status: number, detail: string) {
	return HttpResponse.json({ detail }, { status })
}

export function accessTokenFor(role: TUserRole) {
	return `mock-access-${role}`
}

export function refreshTokenFor(role: TUserRole) {
	return `mock-refresh-${role}`
}

export function userFromToken(token: string | null, prefix: 'mock-access-' | 'mock-refresh-') {
	if (!token?.startsWith(prefix)) return undefined

	const role = token.slice(prefix.length)

	return getDb().users.find((user) => user.role.name === role)
}

type TAuthorizeResult = { user: IUser; response?: never } | { user?: never; response: Response }

export function authorize(request: Request, permission?: TPermission): TAuthorizeResult {
	const header = request.headers.get('Authorization')
	const token = header?.startsWith('Bearer ') ? header.slice('Bearer '.length) : null
	const user = userFromToken(token, 'mock-access-')

	if (!user) {
		return { response: detailResponse(401, 'Token inválido ou expirado') }
	}

	if (permission && !user.permissions.includes(permission)) {
		return { response: detailResponse(403, 'Usuário sem permissão para esta ação') }
	}

	return { user }
}

export function wait(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms))
}
