import { HttpResponse, http } from 'msw'

import type { IRefreshSessionInput, IToken } from '@/@types/auth'
import { accessTokenFor, apiUrl, detailResponse, refreshTokenFor, userFromToken } from '@/api/mocks/http'
import { hasScenario } from '@/api/mocks/scenario'

export const refreshSessionHandler = http.post(apiUrl('/auth/refresh'), async ({ request }) => {
	const body = (await request.json()) as Partial<IRefreshSessionInput>
	const user = userFromToken(body.refresh_token ?? null, 'mock-refresh-')

	if (hasScenario('refresh-invalid') || !user) {
		return detailResponse(401, 'Refresh token inválido')
	}

	return HttpResponse.json<IToken>({
		access_token: accessTokenFor(user.role.name),
		token_type: 'bearer',
		refresh_token: refreshTokenFor(user.role.name),
	})
})
