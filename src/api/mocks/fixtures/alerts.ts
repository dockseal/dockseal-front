import type { IAlert } from '@/@types/alert'
import { mockShipmentId } from '@/api/mocks/fixtures/shipments'
import { MOCK_DIVERGENT_VALIDATION_ID } from '@/api/mocks/fixtures/validations'

export function buildAlerts(): IAlert[] {
	const base = {
		shipment_id: mockShipmentId(1),
		validation_id: MOCK_DIVERGENT_VALIDATION_ID,
		resolution_note: null,
	}

	return [
		{
			...base,
			id: 'e0000000-0000-4000-8000-000000000001',
			severity: 'MEDIA',
			description:
				'peso bruto: O peso bruto na Nota Fiscal (10 t) diverge do Bill of Lading (18 t). Sugestão: Conferir o peso bruto com a balança do terminal.',
			status: 'RESOLVED',
			resolution_note: 'Peso conferido com a transportadora.',
			created_at: '2026-10-10T12:20:01Z',
			updated_at: '2026-10-10T13:00:00Z',
		},
		{
			...base,
			id: 'e0000000-0000-4000-8000-000000000002',
			severity: 'BAIXA',
			description: 'data de emissão: A data de emissão está ausente no Manifesto. Sugestão: Incluir a data de emissão.',
			status: 'OPEN',
			created_at: '2026-10-10T12:20:04Z',
			updated_at: '2026-10-10T12:20:04Z',
		},
		{
			...base,
			id: 'e0000000-0000-4000-8000-000000000003',
			severity: 'CRITICA',
			description:
				'número do contêiner: O número do contêiner na Nota Fiscal (MSCU7654321) difere do Bill of Lading (MSCU1234567). Sugestão: Corrigir o número do contêiner na Nota Fiscal para MSCU1234567.',
			status: 'OPEN',
			created_at: '2026-10-10T12:20:02Z',
			updated_at: '2026-10-10T12:20:02Z',
		},
		{
			...base,
			id: 'e0000000-0000-4000-8000-000000000004',
			severity: 'ALTA',
			description:
				'lacre: O lacre na Nota Fiscal é SL-884599 [?], divergente do Bill of Lading (SL-884512). Sugestão: Corrigir o lacre na Nota Fiscal para SL-884512.',
			status: 'OPEN',
			created_at: '2026-10-10T12:20:03Z',
			updated_at: '2026-10-10T12:20:03Z',
		},
	]
}
