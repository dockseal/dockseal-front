import { type UseMutationOptions, useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { type ISignInBody, type ISignInResponse, signIn } from '@/api/auth/sign-in'

type TUseSignInOptions = Omit<UseMutationOptions<ISignInResponse, Error, ISignInBody, unknown>, 'mutationFn'>

export function useSignIn(options?: TUseSignInOptions) {
	const { onSuccess, onError, ...rest } = options ?? {}

	const mutation = useMutation({
		mutationFn: signIn,
		onSuccess: (data, variables, onMutateResult, context) => {
			console.log(data)

			onSuccess?.(data, variables, onMutateResult, context)
		},
		onError: (error, variables, onMutateResult, context) => {
			console.log(error)
			toast.error('Authentication failed. Please try again later.')
			onError?.(error, variables, onMutateResult, context)
		},
		...rest,
	})

	return mutation
}
