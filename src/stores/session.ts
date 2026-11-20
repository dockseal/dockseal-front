import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { TUserRole } from '@/@types/auth'
import { AUTH_STORAGE_KEY } from '@/constants/auth'

interface ISetSessionInput {
	accessToken: string
	refreshToken: string
	role?: TUserRole
}

interface ISessionState {
	accessToken: string | null
	refreshToken: string | null
	role: TUserRole | null
	setSession: (session: ISetSessionInput) => void
	clearSession: () => void
}

export const useSessionStore = create<ISessionState>()(
	persist(
		(set) => ({
			accessToken: null,
			refreshToken: null,
			role: null,
			setSession: ({ accessToken, refreshToken, role }) =>
				set((state) => ({ accessToken, refreshToken, role: role ?? state.role })),
			clearSession: () => set({ accessToken: null, refreshToken: null, role: null }),
		}),
		{
			name: AUTH_STORAGE_KEY,
			partialize: ({ accessToken, refreshToken, role }) => ({ accessToken, refreshToken, role }),
		},
	),
)
