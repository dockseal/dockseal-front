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
	it('operador registra embarques mas não consulta a lista, a análise nem o histórico', () => {
		expect(hasPermission(buildUser('OPERADOR'), 'shipment:write')).toBe(true)
		expect(hasPermission(buildUser('OPERADOR'), 'shipment:read')).toBe(false)
		expect(hasPermission(buildUser('OPERADOR'), 'analysis:run')).toBe(false)
		expect(hasPermission(buildUser('OPERADOR'), 'history:read')).toBe(false)
		expect(hasPermission(buildUser('OPERADOR'), 'alert:manage')).toBe(false)
	})

	it('ignora permissão da API que o perfil não tem', () => {
		const operator = buildUser('OPERADOR')

		operator.permissions = [...operator.permissions, 'shipment:read']

		expect(hasPermission(operator, 'shipment:read')).toBe(false)
		expect(hasPermission(operator, 'shipment:write')).toBe(true)
	})

	it('gestor trata alertas mas não registra embarques', () => {
		expect(hasPermission(buildUser('GESTOR'), 'alert:manage')).toBe(true)
		expect(hasPermission(buildUser('GESTOR'), 'shipment:write')).toBe(false)
		expect(hasPermission(buildUser('GESTOR'), 'document:upload')).toBe(false)
	})

	it('admin tem todas as permissões, inclusive gerenciar usuários', () => {
		expect(ROLE_PERMISSIONS.ADMIN).toContain('user:manage')

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
		expect(getLandingPath('OPERADOR')).toBe('/shipments/new')
		expect(getLandingPath('GESTOR')).toBe('/dashboard')
		expect(getLandingPath('ADMIN')).toBe('/dashboard')
	})
})
