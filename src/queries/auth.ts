import { queryOptions, useQuery } from '@tanstack/react-query'

import type { IUser } from '@/@types/auth'
import { getMe } from '@/api/auth/get-me'
import { queryClient } from '@/lib/query-client'

export const authQueryKeys = {
	all: ['auth'] as const,
	me: () => [...authQueryKeys.all, 'me'] as const,
}

export function meQueryOptions() {
	return queryOptions({
		queryKey: authQueryKeys.me(),
		queryFn: getMe,
		staleTime: 1000 * 60 * 5,
	})
}

export function useMe() {
	return useQuery(meQueryOptions())
}

export function updateMeCache(updater: (user: IUser | undefined) => IUser | undefined) {
	queryClient.setQueryData(authQueryKeys.me(), updater)
}

export function invalidateMe() {
	return queryClient.invalidateQueries({ queryKey: authQueryKeys.all })
}
