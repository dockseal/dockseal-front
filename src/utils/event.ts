import type { IProcessEvent } from '@/@types/event'
import { EVENT_STATUS_LABEL, EVENT_STEP_LABEL } from '@/constants/event'

export function getEventActorLabel(event: Pick<IProcessEvent, 'user_id'>, currentUserId: string | undefined) {
	if (!event.user_id) return 'Sistema'
	if (event.user_id === currentUserId) return 'Você'

	return `Usuário ${event.user_id.slice(0, 8)}`
}

export function getEventStepLabel(step: string) {
	return EVENT_STEP_LABEL[step] ?? step
}

export function getEventStatusLabel(status: string) {
	return EVENT_STATUS_LABEL[status] ?? status
}
