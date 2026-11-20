import { HttpResponse, http } from 'msw'

import type { IAnalysisResult } from '@/@types/analysis'
import { registerMockEvent } from '@/api/mocks/db'
import { buildConformeResult, buildDivergentResult, buildInconclusivoResult } from '@/api/mocks/fixtures/analysis'
import { apiUrl, authorize, detailResponse, wait } from '@/api/mocks/http'
import { hasScenario } from '@/api/mocks/scenario'
import { ACCEPTED_UPLOAD_EXTENSIONS, MAX_FILES_PER_UPLOAD } from '@/constants/upload'
import { getFileExtension } from '@/utils/file'

export const analyzeDocumentsHandler = http.post(apiUrl('/analysis'), async ({ request }) => {
	const { user, response } = authorize(request, 'analysis:run')

	if (response) return response

	const form = await request.formData()
	const files = form.getAll('files').filter((entry): entry is File => entry instanceof File)
	const names = files.map((file) => file.name)

	await wait(800)

	if (files.length === 0) return detailResponse(422, 'Envie ao menos um arquivo')

	if (files.length > MAX_FILES_PER_UPLOAD) {
		return detailResponse(422, `Envie no máximo ${MAX_FILES_PER_UPLOAD} arquivos por vez`)
	}

	const accepted: readonly string[] = ACCEPTED_UPLOAD_EXTENSIONS
	const unsupported = files.find((file) => !accepted.includes(getFileExtension(file.name)))

	if (hasScenario('analysis-415') || unsupported) {
		return detailResponse(415, `Formato de '${unsupported?.name ?? names[0]}' não é suportado`)
	}

	if (hasScenario('analysis-502')) {
		return detailResponse(502, 'Falha ao analisar os documentos com a IA: serviço indisponível')
	}

	let result: IAnalysisResult = buildDivergentResult(names)

	if (hasScenario('analysis-conforme')) result = buildConformeResult(names)

	if (hasScenario('analysis-inconclusivo')) result = buildInconclusivoResult(names)

	registerMockEvent({ step: 'ANALYSIS', status: result.status, user_id: user.id, shipment_id: null })

	return HttpResponse.json<IAnalysisResult>(result)
})
