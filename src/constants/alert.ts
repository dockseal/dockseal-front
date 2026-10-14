import type { TAlertStatus } from '@/@types/alert'
import type { TSeverity } from '@/@types/analysis'
import type { TTone } from '@/@types/ui'

export const EAlertStatus = {
	OPEN: 'OPEN',
	RESOLVED: 'RESOLVED',
	CLOSED: 'CLOSED',
	DISMISSED: 'DISMISSED',
} as const satisfies Record<string, TAlertStatus>

export const ESeverity = {
	BAIXA: 'BAIXA',
	MEDIA: 'MEDIA',
	ALTA: 'ALTA',
	CRITICA: 'CRITICA',
} as const satisfies Record<string, TSeverity>

export const ALERT_STATUS_LABEL: Record<TAlertStatus, string> = {
	OPEN: 'Aberto',
	RESOLVED: 'Resolvido',
	CLOSED: 'Fechado',
	DISMISSED: 'Falso positivo',
}

export const SEVERITY_LABEL: Record<TSeverity, string> = {
	BAIXA: 'Baixa',
	MEDIA: 'Média',
	ALTA: 'Alta',
	CRITICA: 'Crítica',
}

export const SEVERITY_TONE: Record<TSeverity, TTone> = {
	BAIXA: 'info',
	MEDIA: 'warning',
	ALTA: 'orange',
	CRITICA: 'danger',
}

export const SEVERITY_ORDER: TSeverity[] = ['CRITICA', 'ALTA', 'MEDIA', 'BAIXA']

export const ALERT_STATUSES: TAlertStatus[] = ['OPEN', 'RESOLVED', 'CLOSED', 'DISMISSED']

export const ALERT_RESOLUTION_NOTE_MAX_LENGTH = 2000

export const ALERT_ACTIONS: { status: TAlertStatus; label: string }[] = [
	{ status: 'RESOLVED', label: 'Marcar como resolvido' },
	{ status: 'DISMISSED', label: 'Falso positivo' },
	{ status: 'CLOSED', label: 'Fechar' },
	{ status: 'OPEN', label: 'Reabrir' },
]
