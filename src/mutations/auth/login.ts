import { type UseMutationOptions, useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import type { ILoginInput, ILoginResponse } from '@/@types/auth'
import { login } from '@/api/auth/login'
import { queryClient } from '@/lib/query-client'
import { meQueryOptions } from '@/queries/auth'
import { useSessionStore } from '@/stores/session'
import { getApiErrorMessage } from '@/utils/api-error'

type TUseLoginOptions = Omit<UseMutationOptions<ILoginResponse, Error, ILoginInput>, 'mutationFn'>

export function useLogin(options?: TUseLoginOptions) {
	const { onSuccess, onError, ...rest } = options ?? {}

	return useMutation({
		...rest,
		mutationFn: login,
		onSuccess: async (data, variables, onMutateResult, context) => {
			useSessionStore.getState().setSession({
				accessToken: data.access_token,
				refreshToken: data.refresh_token,
				role: data.user.role,
			})
			await queryClient.fetchQuery(meQueryOptions())
			await onSuccess?.(data, variables, onMutateResult, context)
		},
		onError: (error, variables, onMutateResult, context) => {
			toast.error(getApiErrorMessage(error))
			onError?.(error, variables, onMutateResult, context)
		},
	})
}
