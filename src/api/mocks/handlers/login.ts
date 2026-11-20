import { HttpResponse, http } from 'msw'

import type { ILoginResponse } from '@/@types/auth'
import { getDb, registerMockEvent } from '@/api/mocks/db'
import { MOCK_PASSWORD, MOCK_USER_IDS } from '@/api/mocks/fixtures/users'
import { accessTokenFor, apiUrl, detailResponse, refreshTokenFor } from '@/api/mocks/http'

export const loginHandler = http.post(apiUrl('/auth/login'), async ({ request }) => {
	const form = new URLSearchParams(await request.text())
	const username = form.get('username')?.toLowerCase()
	const password = form.get('password')

	if (!username || !password) {
		return HttpResponse.json(
			{ detail: [{ type: 'missing', loc: ['body', username ? 'password' : 'username'], msg: 'Field required' }] },
			{ status: 422 },
		)
	}

	const seededIds = new Set<string>(Object.values(MOCK_USER_IDS))
	const user = getDb().users.find((candidate) => candidate.email === username && seededIds.has(candidate.id))

	if (!user || password !== MOCK_PASSWORD) {
		registerMockEvent({ step: 'LOGIN', status: 'FAILURE', user_id: user?.id ?? null, shipment_id: null })

		return detailResponse(401, 'E-mail ou senha inválidos')
	}

	registerMockEvent({ step: 'LOGIN', status: 'SUCCESS', user_id: user.id, shipment_id: null })

	return HttpResponse.json<ILoginResponse>({
		access_token: accessTokenFor(user.role.name),
		token_type: 'bearer',
		refresh_token: refreshTokenFor(user.role.name),
		user: { id: user.id, name: user.name, role: user.role.name },
	})
})
