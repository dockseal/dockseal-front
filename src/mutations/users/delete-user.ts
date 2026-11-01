import { type UseMutationOptions, useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { deleteUser } from '@/api/users/delete-user'
import { invalidateEvents } from '@/queries/events'
import { invalidateUsers } from '@/queries/users'
import { getApiErrorMessage } from '@/utils/api-error'

type TUseDeleteUserOptions = Omit<UseMutationOptions<void, Error, string>, 'mutationFn'>

export function useDeleteUser(options?: TUseDeleteUserOptions) {
	const { onSuccess, onError, ...rest } = options ?? {}

	return useMutation({
		...rest,
		mutationFn: deleteUser,
		onSuccess: async (data, variables, onMutateResult, context) => {
			invalidateUsers()
			invalidateEvents()
			toast.success('Usuário excluído.')
			await onSuccess?.(data, variables, onMutateResult, context)
		},
		onError: (error, variables, onMutateResult, context) => {
			toast.error(getApiErrorMessage(error))
			onError?.(error, variables, onMutateResult, context)
		},
	})
}
