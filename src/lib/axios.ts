import * as Sentry from '@sentry/react'
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

const reportedErrors = new WeakSet<object>()

// Troca ids numéricos e UUIDs por :id, para agrupar o mesmo endpoint no Sentry.
function normalizePath(url = '') {
	return url
		.split('?')[0]
		.replace(/\/\d+(?=\/|$)/g, '/:id')
		.replace(/\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}(?=\/|$)/gi, '/:id')
}

function reportApiError(error: unknown) {
	if (!isAxiosError(error) || reportedErrors.has(error)) return
	if (error.code === 'ERR_CANCELED') return

	const status = error.response?.status
	const noResponse = !error.response
	const serverError = status !== undefined && status >= 500

	// 4xx (senha errada, sem permissão, arquivo inválido) são esperados: não reporta.
	if (!noResponse && !serverError) return

	reportedErrors.add(error)

	const method = (error.config?.method ?? 'get').toUpperCase()
	const path = normalizePath(error.config?.url)
	const isTimeout = error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT'
	const kind = noResponse ? (isTimeout ? 'timeout' : 'network') : 'server'

	// Só método, caminho e status: nada de corpo, cabeçalhos ou resposta da API.
	Sentry.captureException(error, {
		tags: { 'api.kind': kind, 'api.method': method, 'api.status': String(status ?? 'none') },
		contexts: { api: { method, path, status, code: error.code } },
		fingerprint: ['api-error', kind, method, path, String(status ?? 'none')],
	})
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

// Precisa ficar depois do interceptor de 401: reporta só o que sobrou de erro.
api.interceptors.response.use(undefined, (error: unknown) => {
	reportApiError(error)

	throw error
})
