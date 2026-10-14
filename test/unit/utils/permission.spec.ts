import { describe, expect, it } from 'vitest'

import type { IUser, TUserRole } from '@/@types/auth'
import { ROLE_PERMISSIONS } from '@/constants/auth'
import { getLandingPath } from '@/utils/navigation'
import { hasPermission } from '@/utils/permission'

function buildUser(role: TUserRole): IUser {
	return {
		id: '11111111-1111-4111-8111-111111111111',
		name: 'Teste',
		email: 'teste@dockseal.test',
		status: 'ACTIVE',
		role: { name: role },
		permissions: ROLE_PERMISSIONS[role],
	}
}

describe('hasPermission', () => {
	it('operador registra embarques mas não consulta histórico', () => {
		expect(hasPermission(buildUser('OPERADOR'), 'shipment:write')).toBe(true)
		expect(hasPermission(buildUser('OPERADOR'), 'history:read')).toBe(false)
		expect(hasPermission(buildUser('OPERADOR'), 'alert:manage')).toBe(false)
	})

	it('gestor trata alertas mas não registra embarques', () => {
		expect(hasPermission(buildUser('GESTOR'), 'alert:manage')).toBe(true)
		expect(hasPermission(buildUser('GESTOR'), 'shipment:write')).toBe(false)
		expect(hasPermission(buildUser('GESTOR'), 'document:upload')).toBe(false)
	})

	it('admin tem todas as permissões', () => {
		for (const permission of ROLE_PERMISSIONS.ADMIN) {
			expect(hasPermission(buildUser('ADMIN'), permission)).toBe(true)
		}
	})

	it('usuário ausente não tem permissão', () => {
		expect(hasPermission(undefined, 'shipment:read')).toBe(false)
	})
})

describe('getLandingPath', () => {
	it('direciona por perfil', () => {
		expect(getLandingPath('OPERADOR')).toBe('/embarques')
		expect(getLandingPath('GESTOR')).toBe('/dashboard')
		expect(getLandingPath('ADMIN')).toBe('/dashboard')
	})
})
