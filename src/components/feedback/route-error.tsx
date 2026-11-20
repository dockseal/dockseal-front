import { type ErrorComponentProps, useRouter } from '@tanstack/react-router'

import { ErrorState } from '@/components/feedback/error-state'
import { getApiErrorMessage } from '@/utils/api-error'

export function RouteError({ error, reset }: ErrorComponentProps) {
	const router = useRouter()

	function handleRetry() {
		reset()
		router.invalidate()
	}

	return (
		<main className="mx-auto flex min-h-svh w-full max-w-lg items-center p-6">
			<ErrorState title="Algo deu errado" message={getApiErrorMessage(error)} onRetry={handleRetry} />
		</main>
	)
}
