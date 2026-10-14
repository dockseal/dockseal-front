import { HttpResponse, http } from 'msw'

import type { IValidation } from '@/@types/analysis'
import { getDb, registerMockEvent } from '@/api/mocks/db'
import { buildDivergentResult } from '@/api/mocks/fixtures/analysis'
import { apiUrl, authorize, detailResponse, wait } from '@/api/mocks/http'
import { hasScenario } from '@/api/mocks/scenario'

export const validateShipmentHandler = http.post(
	apiUrl('/shipments/:shipmentId/validate'),
	async ({ request, params }) => {
		const { user, response } = authorize(request, 'analysis:run')

		if (response) return response

		const db = getDb()
		const shipmentId = String(params.shipmentId)
		const shipment = db.shipments.find((candidate) => candidate.id === shipmentId)

		if (!shipment) return detailResponse(404, 'Embarque não encontrado')

		await wait(hasScenario('validate-slow') ? 1500 : 200)

		const documents = db.documents[shipmentId] ?? []

		if (hasScenario('validate-422-no-documents') || documents.length === 0) {
			return detailResponse(422, 'O embarque não possui documentos com texto extraído para analisar.')
		}

		if (hasScenario('validate-502')) {
			return detailResponse(502, 'Falha ao analisar os documentos com a IA: serviço indisponível')
		}

		const result = buildDivergentResult(documents.map((document) => document.filename))
		const validation: IValidation = {
			id: crypto.randomUUID(),
			status: result.status,
			details: result.summary,
			confidence_score: result.confidence,
			shipment_id: shipmentId,
			result,
			created_at: new Date().toISOString(),
		}

		db.validations[shipmentId] = [validation, ...(db.validations[shipmentId] ?? [])]

		for (const divergence of result.divergences ?? []) {
			if (divergence.severity === 'BAIXA') continue

			db.alerts.push({
				id: crypto.randomUUID(),
				severity: divergence.severity,
				description: `${divergence.field}: ${divergence.description} Sugestão: ${divergence.suggestion}`,
				status: 'OPEN',
				resolution_note: null,
				shipment_id: shipmentId,
				validation_id: validation.id,
				created_at: validation.created_at,
				updated_at: validation.created_at,
			})
		}

		shipment.status = result.status === 'CONFORME' ? 'VALIDATED' : 'PENDING_REVIEW'
		registerMockEvent({ step: 'VALIDATION', status: result.status, user_id: user.id, shipment_id: shipmentId })

		return HttpResponse.json<IValidation>(validation)
	},
)
