import { HttpResponse, http } from 'msw'

import type { IShipmentDocument, TDocumentType } from '@/@types/document'
import { getDb, registerMockEvent } from '@/api/mocks/db'
import { apiUrl, authorize, detailResponse, wait } from '@/api/mocks/http'
import { hasScenario } from '@/api/mocks/scenario'
import { ACCEPTED_UPLOAD_EXTENSIONS } from '@/constants/upload'
import { getFileExtension } from '@/utils/file'

const DOCUMENT_TYPES = ['BILL_OF_LADING', 'MANIFESTO_CARGA', 'NOTA_FISCAL', 'ORDEM_CARREGAMENTO', 'OUTRO']

export const uploadShipmentDocumentsHandler = http.post(
	apiUrl('/shipments/:shipmentId/documents'),
	async ({ request, params }) => {
		const { user, response } = authorize(request, 'document:upload')

		if (response) return response

		const db = getDb()
		const shipmentId = String(params.shipmentId)

		if (!db.shipments.some((shipment) => shipment.id === shipmentId)) {
			return detailResponse(404, 'Embarque não encontrado')
		}

		const form = await request.formData()
		const files = form.getAll('files').filter((entry): entry is File => entry instanceof File)
		const types = form.getAll('types').map(String)

		await wait(800)

		if (files.length === 0) return detailResponse(422, 'Envie ao menos um arquivo')

		if (types.length > 0 && types.length !== files.length) {
			return detailResponse(422, 'Informe um tipo para cada arquivo')
		}

		const accepted: readonly string[] = ACCEPTED_UPLOAD_EXTENSIONS
		const unsupported = files.find((file) => !accepted.includes(getFileExtension(file.name)))

		if (hasScenario('upload-415') || unsupported) {
			return detailResponse(415, `Formato de '${unsupported?.name ?? files[0].name}' não é suportado`)
		}

		if (hasScenario('upload-413')) {
			return detailResponse(413, `'${files[0].name}' excede o limite de 20 MB`)
		}

		if (hasScenario('upload-422-empty-text')) {
			return detailResponse(422, `Nenhum texto encontrado em '${files[0].name}'`)
		}

		const created: IShipmentDocument[] = []

		files.forEach((file, index) => {
			const rawType = types[index] ?? 'OUTRO'

			if (rawType === 'CONTAINER_PHOTO') {
				db.evidences[shipmentId] = [
					...(db.evidences[shipmentId] ?? []),
					{
						id: crypto.randomUUID(),
						type: 'FOTO_CONTAINER',
						mime_type: file.type || 'image/png',
						url: '/favicon.svg',
						location: null,
						created_at: new Date().toISOString(),
					},
				]
				return
			}

			const type = (rawType === 'INVOICE' ? 'NOTA_FISCAL' : rawType) as TDocumentType

			created.push({
				id: crypto.randomUUID(),
				type: DOCUMENT_TYPES.includes(type) ? type : 'OUTRO',
				filename: file.name,
				status: 'EXTRACTED',
				created_at: new Date().toISOString(),
			})
		})

		db.documents[shipmentId] = [...(db.documents[shipmentId] ?? []), ...created]
		registerMockEvent({
			step: 'DOCUMENTS_UPLOADED',
			status: 'SUCCESS',
			user_id: user.id,
			shipment_id: shipmentId,
			observation: `${files.length} arquivo(s)`,
		})

		return HttpResponse.json<IShipmentDocument[]>(created, { status: 201 })
	},
)
