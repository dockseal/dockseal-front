import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'

import { queryClient } from '@/lib/query-client'
import { useSessionStore } from '@/stores/session'

export function useLogout() {
	const navigate = useNavigate()
	const clearSession = useSessionStore((state) => state.clearSession)

	return async function logout() {
		clearSession()
		queryClient.clear()
		await navigate({ to: '/login' })
		toast.success('Sessão encerrada.')
	}
}
