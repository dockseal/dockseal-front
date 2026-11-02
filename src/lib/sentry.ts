import * as Sentry from '@sentry/react'
import type { AnyRouter } from '@tanstack/react-router'

function parseSampleRate(value: unknown, fallback: number) {
	const rate = Number(value)

	return Number.isFinite(rate) && rate >= 0 && rate <= 1 ? rate : fallback
}

export function initSentry(router: AnyRouter) {
	const dsn = import.meta.env.VITE_SENTRY_DSN

	if (!dsn) {
		console.warn('[Sentry] VITE_SENTRY_DSN não encontrado: Sentry desligado')
		return
	}

	const apiUrl = import.meta.env.VITE_API_URL

	Sentry.init({
		dsn,
		environment: import.meta.env.VITE_SENTRY_ENVIRONMENT || 'local',
		release: import.meta.env.VITE_SENTRY_RELEASE || undefined,

		integrations: [Sentry.tanstackRouterBrowserTracingIntegration(router)],
		tracesSampleRate: parseSampleRate(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE, 1),
		// O trace só é enviado para a nossa API, e nunca para terceiros.
		tracePropagationTargets: apiUrl ? [apiUrl] : [],

		// Console e digitação em campos podem conter dados de documentos ou senhas.
		beforeBreadcrumb(breadcrumb) {
			if (breadcrumb.category === 'console') return null
			if (breadcrumb.category === 'ui.input') return null

			return breadcrumb
		},

		beforeSend(event) {
			if (event.request) {
				delete event.request.cookies
				delete event.request.data
			}

			// Do usuário, mantém só o id (sem e-mail, nome ou IP).
			if (event.user) {
				event.user = event.user.id ? { id: event.user.id } : {}
			}

			return event
		},
	})
}
