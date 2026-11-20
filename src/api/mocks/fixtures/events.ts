import type { IProcessEvent } from '@/@types/event'
import { mockShipmentId } from '@/api/mocks/fixtures/shipments'
import { MOCK_USER_IDS } from '@/api/mocks/fixtures/users'

export function buildEvents(): IProcessEvent[] {
	const shipmentId = mockShipmentId(1)
	const event = (
		index: number,
		step: string,
		status: string,
		createdAt: string,
		overrides: Partial<IProcessEvent> = {},
	): IProcessEvent => ({
		id: `f0000000-0000-4000-8000-${String(index).padStart(12, '0')}`,
		step,
		status,
		observation: null,
		user_id: MOCK_USER_IDS.OPERADOR,
		shipment_id: shipmentId,
		created_at: createdAt,
		...overrides,
	})

	return [
		event(8, 'ALERT_RESOLVED', 'SUCCESS', '2026-10-10T13:00:00Z', {
			user_id: MOCK_USER_IDS.GESTOR,
			observation: 'Peso conferido com a transportadora.',
		}),
		event(7, 'VALIDATION', 'DIVERGENTE', '2026-10-10T12:20:00Z'),
		event(6, 'DOCUMENTS_UPLOADED', 'SUCCESS', '2026-10-10T12:11:00Z', { observation: '2 documento(s)' }),
		event(5, 'CONTAINER_ASSOCIATED', 'SUCCESS', '2026-10-10T12:05:00Z', { observation: 'MSCU1234567' }),
		event(4, 'SHIPMENT_CREATED', 'SUCCESS', '2026-10-10T12:00:00Z'),
		event(3, 'ANALYSIS', 'CONFORME', '2026-10-09T15:00:00Z', { shipment_id: null }),
		event(2, 'LOGIN', 'FAILURE', '2026-10-09T09:59:00Z', { shipment_id: null, user_id: null }),
		event(1, 'LOGIN', 'SUCCESS', '2026-10-09T10:00:00Z', { shipment_id: null, user_id: MOCK_USER_IDS.GESTOR }),
	]
}
