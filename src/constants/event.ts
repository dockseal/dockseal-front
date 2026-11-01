import type { TTone } from '@/@types/ui'

export const EVENT_STEP_LABEL: Record<string, string> = {
	LOGIN: 'Login',
	SHIPMENT_CREATED: 'Embarque registrado',
	CONTAINER_ASSOCIATED: 'Contêiner associado',
	DOCUMENTS_UPLOADED: 'Documentos enviados',
	VALIDATION: 'Validação do embarque',
	ANALYSIS: 'Análise de documentos avulsos',
	ALERT_OPEN: 'Alerta reaberto',
	ALERT_RESOLVED: 'Alerta resolvido',
	ALERT_CLOSED: 'Alerta fechado',
	ALERT_DISMISSED: 'Alerta marcado como falso positivo',
	USER_CREATED: 'Usuário criado',
	USER_UPDATED: 'Usuário atualizado',
	USER_DELETED: 'Usuário excluído',
}

export const EVENT_STATUS_TONE: Record<string, TTone> = {
	SUCCESS: 'success',
	FAILURE: 'danger',
	CONFORME: 'success',
	DIVERGENTE: 'danger',
	INCONCLUSIVO: 'warning',
}

export const EVENT_STATUS_LABEL: Record<string, string> = {
	SUCCESS: 'Sucesso',
	FAILURE: 'Falha',
	CONFORME: 'Conforme',
	DIVERGENTE: 'Divergente',
	INCONCLUSIVO: 'Inconclusivo',
}
