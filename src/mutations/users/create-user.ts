import { type UseMutationOptions, useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import type { ICreateUserInput, IUser } from '@/@types/auth'
import { createUser } from '@/api/users/create-user'
import { invalidateEvents } from '@/queries/events'
import { invalidateUsers } from '@/queries/users'
import { getApiErrorMessage } from '@/utils/api-error'

type TUseCreateUserOptions = Omit<UseMutationOptions<IUser, Error, ICreateUserInput>, 'mutationFn'>

export function useCreateUser(options?: TUseCreateUserOptions) {
	const { onSuccess, onError, ...rest } = options ?? {}

	return useMutation({
		...rest,
		mutationFn: createUser,
		onSuccess: async (data, variables, onMutateResult, context) => {
			invalidateUsers()
			invalidateEvents()
			toast.success('Usuário criado.')
			await onSuccess?.(data, variables, onMutateResult, context)
		},
		onError: (error, variables, onMutateResult, context) => {
			toast.error(getApiErrorMessage(error))
			onError?.(error, variables, onMutateResult, context)
		},
	})
}
