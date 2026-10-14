import axios, { isAxiosError } from 'axios'

import { refreshSession } from '@/api/auth/refresh-session'
import { DEFAULT_REQUEST_TIMEOUT_MS } from '@/constants/api'
import { env } from '@/env'
import { queryClient } from '@/lib/query-client'
import { useSessionStore } from '@/stores/session'

const SESSION_URLS = ['/auth/login', '/auth/refresh']

export const api = axios.create({
	baseURL: env.VITE_API_URL,
	timeout: DEFAULT_REQUEST_TIMEOUT_MS,
})

api.interceptors.request.use((config) => {
	const token = useSessionStore.getState().accessToken

	if (token && !config.url?.startsWith('/auth/refresh')) {
		config.headers.set('Authorization', `Bearer ${token}`)
	}

	return config
})

if (env.VITE_ENABLE_API_DELAY) {
	api.interceptors.request.use(async (config) => {
		await new Promise((resolve) => setTimeout(resolve, Math.random() * 3000))

		return config
	})
}

let pendingRefresh: Promise<string> | null = null

async function renewAccessToken() {
	const { refreshToken, setSession } = useSessionStore.getState()

	if (!refreshToken) throw new Error('Sessão ausente')

	const tokens = await refreshSession({ refresh_token: refreshToken })

	setSession({ accessToken: tokens.access_token, refreshToken: tokens.refresh_token })

	return tokens.access_token
}

function endSession() {
	useSessionStore.getState().clearSession()
	queryClient.clear()
}

api.interceptors.response.use(undefined, async (error: unknown) => {
	if (!isAxiosError(error) || error.response?.status !== 401 || !error.config) {
		throw error
	}

	const config = error.config
	const isSessionUrl = SESSION_URLS.some((url) => config.url?.startsWith(url))

	if (isSessionUrl || config._retry) {
		if (config._retry) endSession()

		throw error
	}

	try {
		pendingRefresh ??= renewAccessToken().finally(() => {
			pendingRefresh = null
		})

		const accessToken = await pendingRefresh

		config._retry = true
		config.headers.set('Authorization', `Bearer ${accessToken}`)

		return api.request(config)
	} catch {
		endSession()

		throw error
	}
})
