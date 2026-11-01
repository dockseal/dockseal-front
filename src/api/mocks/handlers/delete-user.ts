import { http } from 'msw'

import { getDb, registerMockEvent } from '@/api/mocks/db'
import { apiUrl, authorize, detailResponse } from '@/api/mocks/http'

export const deleteUserHandler = http.delete(apiUrl('/users/:userId'), ({ request, params }) => {
	const { user: actor, response } = authorize(request, 'user:manage')

	if (response) return response

	const db = getDb()
	const userId = String(params.userId)
	const current = db.users.find((user) => user.id === userId)

	if (!current) return detailResponse(404, 'Usuário não encontrado')

	if (current.id === actor.id) {
		return detailResponse(422, 'Você não pode excluir o próprio usuário.')
	}

	db.users = db.users.filter((user) => user.id !== userId)

	for (const event of db.events) {
		if (event.user_id === userId) event.user_id = null
	}

	registerMockEvent({
		step: 'USER_DELETED',
		status: 'SUCCESS',
		user_id: actor.id,
		shipment_id: null,
		observation: `Usuário ${current.email} excluído.`,
	})

	return new Response(null, { status: 204 })
})
