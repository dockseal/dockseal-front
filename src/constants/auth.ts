import type { TPermission, TUserRole } from '@/@types/auth'

export const AUTH_STORAGE_KEY = '@dockseal:auth'

export const EUserRole = {
	OPERADOR: 'OPERADOR',
	GESTOR: 'GESTOR',
	ADMIN: 'ADMIN',
} as const satisfies Record<string, TUserRole>

export const EPermission = {
	SHIPMENT_READ: 'shipment:read',
	SHIPMENT_WRITE: 'shipment:write',
	DOCUMENT_UPLOAD: 'document:upload',
	ANALYSIS_RUN: 'analysis:run',
	ALERT_READ: 'alert:read',
	ALERT_MANAGE: 'alert:manage',
	HISTORY_READ: 'history:read',
	USER_MANAGE: 'user:manage',
} as const satisfies Record<string, TPermission>

export const USER_ROLE_LABEL: Record<TUserRole, string> = {
	OPERADOR: 'Operador',
	GESTOR: 'Gestor',
	ADMIN: 'Administrador',
}

export const PERMISSION_LABEL: Record<TPermission, string> = {
	'shipment:read': 'Consultar embarques',
	'shipment:write': 'Registrar embarques',
	'document:upload': 'Enviar documentos',
	'analysis:run': 'Executar análise com IA',
	'alert:read': 'Consultar alertas',
	'alert:manage': 'Tratar alertas',
	'history:read': 'Consultar histórico',
	'user:manage': 'Gerenciar usuários',
}

export const ROLE_PERMISSIONS: Record<TUserRole, TPermission[]> = {
	OPERADOR: ['shipment:write', 'document:upload', 'alert:read'],
	GESTOR: ['shipment:read', 'analysis:run', 'alert:read', 'alert:manage', 'history:read'],
	ADMIN: [
		'shipment:read',
		'shipment:write',
		'document:upload',
		'analysis:run',
		'alert:read',
		'alert:manage',
		'history:read',
		'user:manage',
	],
}
