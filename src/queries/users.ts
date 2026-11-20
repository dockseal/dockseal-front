import { keepPreviousData, useQuery } from '@tanstack/react-query'

import type { IGetUsersFilters } from '@/@types/auth'
import { getUsers } from '@/api/users/get-users'
import { queryClient } from '@/lib/query-client'

export const usersQueryKeys = {
	all: ['users'] as const,
	lists: () => [...usersQueryKeys.all, 'list'] as const,
	list: (filters: IGetUsersFilters) => [...usersQueryKeys.lists(), filters] as const,
}

export function useUsers(filters: IGetUsersFilters) {
	return useQuery({
		queryKey: usersQueryKeys.list(filters),
		queryFn: () => getUsers(filters),
		placeholderData: keepPreviousData,
	})
}

export function invalidateUsers() {
	return queryClient.invalidateQueries({ queryKey: usersQueryKeys.all })
}
