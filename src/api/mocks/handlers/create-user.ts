import { HttpResponse, http } from 'msw'

import type { ICreateUserInput, IUser, TUserRole } from '@/@types/auth'
import { getDb, registerMockEvent } from '@/api/mocks/db'
import { apiUrl, authorize, detailResponse } from '@/api/mocks/http'
import { ROLE_PERMISSIONS } from '@/constants/auth'

export const createUserHandler = http.post(apiUrl('/users'), async ({ request }) => {
	const { user: actor, response } = authorize(request, 'user:manage')

	if (response) return response

	const body = (await request.json()) as ICreateUserInput
	const email = body.email.trim().toLowerCase()
	const db = getDb()

	if (db.users.some((user) => user.email === email)) {
		return detailResponse(422, 'E-mail já cadastrado')
	}

	const role = body.role
	const created: IUser = {
		id: crypto.randomUUID(),
		name: body.name.trim(),
		email,
		status: 'ACTIVE',
		role: { name: role },
		permissions: ROLE_PERMISSIONS[role as TUserRole] ?? [],
	}

	db.users.push(created)
	registerMockEvent({
		step: 'USER_CREATED',
		status: 'SUCCESS',
		user_id: actor.id,
		shipment_id: null,
		observation: `Usuário ${email} criado com o perfil ${role}.`,
	})

	return HttpResponse.json<IUser>(created, { status: 201 })
})
