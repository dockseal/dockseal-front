import { http } from 'msw'

import { getDb, registerMockEvent } from '@/api/mocks/db'
import { apiUrl, authorize, detailResponse } from '@/api/mocks/http'

export const deleteShipmentDocumentHandler = http.delete(
	apiUrl('/shipments/:shipmentId/documents/:documentId'),
	({ request, params }) => {
		const { user, response } = authorize(request, 'document:upload')

		if (response) return response

		const db = getDb()
		const shipmentId = String(params.shipmentId)

		if (!db.shipments.some((shipment) => shipment.id === shipmentId)) {
			return detailResponse(404, 'Embarque não encontrado')
		}

		const documents = db.documents[shipmentId] ?? []
		const document = documents.find((item) => item.id === String(params.documentId))

		if (!document) return detailResponse(404, 'Documento não encontrado')

		db.documents[shipmentId] = documents.filter((item) => item.id !== document.id)
		registerMockEvent({
			step: 'DOCUMENT_DELETED',
			status: 'SUCCESS',
			user_id: user.id,
			shipment_id: shipmentId,
			observation: document.filename,
		})

		return new Response(null, { status: 204 })
	},
)

export const deleteShipmentEvidenceHandler = http.delete(
	apiUrl('/shipments/:shipmentId/evidences/:evidenceId'),
	({ request, params }) => {
		const { user, response } = authorize(request, 'document:upload')

		if (response) return response

		const db = getDb()
		const shipmentId = String(params.shipmentId)

		if (!db.shipments.some((shipment) => shipment.id === shipmentId)) {
			return detailResponse(404, 'Embarque não encontrado')
		}

		const evidences = db.evidences[shipmentId] ?? []
		const evidence = evidences.find((item) => item.id === String(params.evidenceId))

		if (!evidence) return detailResponse(404, 'Evidência não encontrada')

		db.evidences[shipmentId] = evidences.filter((item) => item.id !== evidence.id)
		registerMockEvent({
			step: 'EVIDENCE_DELETED',
			status: 'SUCCESS',
			user_id: user.id,
			shipment_id: shipmentId,
			observation: evidence.type,
		})

		return new Response(null, { status: 204 })
	},
)
