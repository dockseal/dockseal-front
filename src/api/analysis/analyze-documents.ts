import type { IAnalysisResult } from '@/@types/analysis'
import { LONG_REQUEST_TIMEOUT_MS } from '@/constants/api'
import { api } from '@/lib/axios'

export async function analyzeDocuments(files: File[]) {
	const body = new FormData()

	for (const file of files) {
		body.append('files', file)
	}

	const response = await api.post<IAnalysisResult>('/analysis', body, { timeout: LONG_REQUEST_TIMEOUT_MS })

	return response.data
}
