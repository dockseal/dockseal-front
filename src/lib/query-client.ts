import * as Sentry from '@sentry/react'
import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'

import { getApiErrorStatus } from '@/utils/api-error'

const MAX_QUERY_RETRIES = 1

function reportUnexpected(error: unknown, source: 'query' | 'mutation') {
	if (isAxiosError(error)) return

	Sentry.captureException(error, { tags: { 'react-query.source': source } })
}

export const queryClient = new QueryClient({
	queryCache: new QueryCache({
		onError: (error) => reportUnexpected(error, 'query'),
	}),
	mutationCache: new MutationCache({
		onError: (error) => reportUnexpected(error, 'mutation'),
	}),
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
