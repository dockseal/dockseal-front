import { type UseMutationOptions, useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import type { IAlert } from '@/@types/alert'
import { updateAlert } from '@/api/alerts/update-alert'
import { invalidateAlerts, updateAlertsCache } from '@/queries/alerts'
import { invalidateDashboard } from '@/queries/dashboard'
import { invalidateEvents } from '@/queries/events'
import { getApiErrorMessage } from '@/utils/api-error'

type TUpdateAlertVariables = Parameters<typeof updateAlert>[0]

type TUseUpdateAlertOptions = Omit<UseMutationOptions<IAlert, Error, TUpdateAlertVariables>, 'mutationFn'>

export function useUpdateAlert(options?: TUseUpdateAlertOptions) {
	const { onSuccess, onError, ...rest } = options ?? {}

	return useMutation({
		...rest,
		mutationFn: updateAlert,
		onSuccess: async (data, variables, onMutateResult, context) => {
			updateAlertsCache(data)
			invalidateAlerts()
			invalidateDashboard()
			invalidateEvents()
			toast.success('Alerta atualizado.')
			await onSuccess?.(data, variables, onMutateResult, context)
		},
		onError: (error, variables, onMutateResult, context) => {
			toast.error(getApiErrorMessage(error))
			onError?.(error, variables, onMutateResult, context)
		},
	})
}
