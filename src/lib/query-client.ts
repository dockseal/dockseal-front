import { QueryClient } from '@tanstack/react-query'

import { getApiErrorStatus } from '@/utils/api-error'

const MAX_QUERY_RETRIES = 1

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 2,
			retry: (failureCount, error) => {
				const status = getApiErrorStatus(error)

				if (status !== undefined && status < 500) return false

				return failureCount < MAX_QUERY_RETRIES
			},
		},
		mutations: {
			retry: false,
		},
	},
})
