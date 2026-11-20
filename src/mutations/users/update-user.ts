import { type UseMutationOptions, useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import type { IUpdateUserInput, IUser } from '@/@types/auth'
import { updateUser } from '@/api/users/update-user'
import { queryClient } from '@/lib/query-client'
import { authQueryKeys, invalidateMe } from '@/queries/auth'
import { invalidateEvents } from '@/queries/events'
import { invalidateUsers } from '@/queries/users'
import { getApiErrorMessage } from '@/utils/api-error'

interface IUpdateUserVariables {
	userId: string
	input: IUpdateUserInput
}

type TUseUpdateUserOptions = Omit<UseMutationOptions<IUser, Error, IUpdateUserVariables>, 'mutationFn'>

export function useUpdateUser(options?: TUseUpdateUserOptions) {
	const { onSuccess, onError, ...rest } = options ?? {}

	return useMutation({
		...rest,
		mutationFn: ({ userId, input }) => updateUser(userId, input),
		onSuccess: async (data, variables, onMutateResult, context) => {
			invalidateUsers()
			invalidateEvents()

			const me = queryClient.getQueryData<IUser>(authQueryKeys.me())

			if (me?.id === data.id) invalidateMe()

			toast.success('Usuário atualizado.')
			await onSuccess?.(data, variables, onMutateResult, context)
		},
		onError: (error, variables, onMutateResult, context) => {
			toast.error(getApiErrorMessage(error))
			onError?.(error, variables, onMutateResult, context)
		},
	})
}
