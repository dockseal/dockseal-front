import type { IUser, TPermission, TUserRole } from '@/@types/auth'
import { ROLE_PERMISSIONS } from '@/constants/auth'

const API_ROLE_PERMISSIONS: Record<TUserRole, TPermission[]> = {
	OPERADOR: ['shipment:write', 'shipment:read', 'document:upload', 'analysis:run', 'alert:read'],
	GESTOR: ROLE_PERMISSIONS.GESTOR,
	ADMIN: ROLE_PERMISSIONS.ADMIN,
}

export const MOCK_PASSWORD = 'Senha@123'

export const MOCK_USER_IDS: Record<TUserRole, string> = {
	OPERADOR: '11111111-1111-4111-8111-111111111111',
	GESTOR: '22222222-2222-4222-8222-222222222222',
	ADMIN: '33333333-3333-4333-8333-333333333333',
}

function buildUser(role: TUserRole, name: string, email: string): IUser {
	return {
		id: MOCK_USER_IDS[role],
		name,
		email,
		status: 'ACTIVE',
		role: { name: role },
		permissions: API_ROLE_PERMISSIONS[role],
	}
}

export function buildUsers(): IUser[] {
	return [
		buildUser('OPERADOR', 'Operador Teste', 'operador@dockseal.test'),
		buildUser('GESTOR', 'Gestor Teste', 'gestor@dockseal.test'),
		buildUser('ADMIN', 'Admin Teste', 'admin@dockseal.test'),
	]
}
