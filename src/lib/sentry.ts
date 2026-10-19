import * as Sentry from '@sentry/react'

export function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN
  if (!dsn) {
    console.warn('[Sentry] VITE_SENTRY_DSN não encontrado: Sentry desligado')
    return
  }

  Sentry.init({
    dsn,
    environment: import.meta.env.VITE_SENTRY_ENVIRONMENT || 'local',
    release: import.meta.env.VITE_SENTRY_RELEASE || undefined,

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

  // Sentry.captureException(new Error('Testando Sentry front')) // TESTE
}