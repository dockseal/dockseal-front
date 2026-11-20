import { HttpResponse, http } from 'msw'

import type { IUpdateUserInput, IUser, TUserRole } from '@/@types/auth'
import { getDb, registerMockEvent } from '@/api/mocks/db'
import { apiUrl, authorize, detailResponse } from '@/api/mocks/http'
import { ROLE_PERMISSIONS } from '@/constants/auth'

export const updateUserHandler = http.patch(apiUrl('/users/:userId'), async ({ request, params }) => {
	const { user: actor, response } = authorize(request, 'user:manage')

	if (response) return response

	const db = getDb()
	const userId = String(params.userId)
	const current = db.users.find((user) => user.id === userId)

	if (!current) return detailResponse(404, 'Usuário não encontrado')

	const body = (await request.json()) as IUpdateUserInput
	const email = body.email?.trim().toLowerCase()

	if (email && db.users.some((user) => user.email === email && user.id !== userId)) {
		return detailResponse(422, 'E-mail já cadastrado')
	}

	const role = body.role ?? current.role.name
	const updated: IUser = {
		...current,
		name: body.name?.trim() || current.name,
		email: email || current.email,
		status: body.status ?? current.status,
		role: { name: role },
		permissions: ROLE_PERMISSIONS[role as TUserRole] ?? current.permissions,
	}
	const index = db.users.findIndex((user) => user.id === userId)

	db.users[index] = updated
	registerMockEvent({
		step: 'USER_UPDATED',
		status: 'SUCCESS',
		user_id: actor.id,
		shipment_id: null,
		observation: `Usuário ${updated.email} atualizado.`,
	})

	return HttpResponse.json<IUser>(updated)
})
