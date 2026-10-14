import type { IValidation } from '@/@types/analysis'
import { buildConformeResult, buildDivergentResult } from '@/api/mocks/fixtures/analysis'
import { mockShipmentId } from '@/api/mocks/fixtures/shipments'

export const MOCK_DIVERGENT_VALIDATION_ID = 'b0000000-0000-4000-8000-000000000001'

export function buildValidations(): Record<string, IValidation[]> {
	const divergent = buildDivergentResult()
	const conforme = buildConformeResult(['bill_of_lading.pdf', 'nota_fiscal.docx'])

	return {
		[mockShipmentId(1)]: [
			{
				id: MOCK_DIVERGENT_VALIDATION_ID,
				status: 'DIVERGENTE',
				details: divergent.summary,
				confidence_score: divergent.confidence,
				shipment_id: mockShipmentId(1),
				result: divergent,
				created_at: '2026-10-10T12:20:00Z',
			},
			{
				id: 'b0000000-0000-4000-8000-000000000002',
				status: 'CONFORME',
				details: conforme.summary,
				confidence_score: conforme.confidence,
				shipment_id: mockShipmentId(1),
				result: conforme,
				created_at: '2026-10-09T12:20:00Z',
			},
		],
	}
}
