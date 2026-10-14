import { HttpResponse, http } from 'msw'

import type { IUser } from '@/@types/auth'
import { getDb } from '@/api/mocks/db'
import { apiUrl, authorize, detailResponse } from '@/api/mocks/http'
import { hasScenario } from '@/api/mocks/scenario'

export const getMeHandler = http.get(apiUrl('/auth/me'), ({ request }) => {
	const db = getDb()

	if (hasScenario('me-network-error')) return HttpResponse.error()

	if (hasScenario('refresh-invalid')) {
		return detailResponse(401, 'Token inválido ou expirado')
	}

	if (hasScenario('me-expired-once') && !db.consumedOnce.has('me-expired-once')) {
		db.consumedOnce.add('me-expired-once')

		return detailResponse(401, 'Token inválido ou expirado')
	}

	const { user, response } = authorize(request)

	if (response) return response

	return HttpResponse.json<IUser>(user)
})
