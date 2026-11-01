import { HttpResponse, http } from 'msw'

import type { IUser } from '@/@types/auth'
import { getDb } from '@/api/mocks/db'
import { apiUrl, authorize } from '@/api/mocks/http'

export const getUsersHandler = http.get(apiUrl('/users'), ({ request }) => {
	const { response } = authorize(request, 'user:manage')

	if (response) return response

	const url = new URL(request.url)
	const limit = Number(url.searchParams.get('limit') ?? 50)
	const offset = Number(url.searchParams.get('offset') ?? 0)
	const users = [...getDb().users].sort((left, right) => {
		const byName = left.name.localeCompare(right.name, 'pt-BR')

		return byName === 0 ? left.email.localeCompare(right.email, 'pt-BR') : byName
	})

	return HttpResponse.json<IUser[]>(users.slice(offset, offset + limit))
})
