import { type UseMutationOptions, useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import type { IAnalysisResult } from '@/@types/analysis'
import { analyzeDocuments } from '@/api/analysis/analyze-documents'
import { invalidateEvents } from '@/queries/events'
import { getApiErrorMessage } from '@/utils/api-error'

type TUseAnalyzeDocumentsOptions = Omit<UseMutationOptions<IAnalysisResult, Error, File[]>, 'mutationFn'>

export function useAnalyzeDocuments(options?: TUseAnalyzeDocumentsOptions) {
	const { onSuccess, onError, ...rest } = options ?? {}

	return useMutation({
		...rest,
		mutationFn: analyzeDocuments,
		onSuccess: async (data, variables, onMutateResult, context) => {
			invalidateEvents()
			await onSuccess?.(data, variables, onMutateResult, context)
		},
		onError: (error, variables, onMutateResult, context) => {
			toast.error(getApiErrorMessage(error))
			onError?.(error, variables, onMutateResult, context)
		},
	})
}
