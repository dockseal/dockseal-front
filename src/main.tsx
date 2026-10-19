import * as Sentry from '@sentry/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { enableMSW } from '@/api/mocks'
import { App } from '@/app'
import { initSentry } from '@/lib/sentry'

import '@/styles/global.css'

initSentry()

enableMSW().then(() => {
  createRoot(document.getElementById('root')!, {
    onUncaughtError: Sentry.reactErrorHandler(),
    onCaughtError: Sentry.reactErrorHandler(),
    onRecoverableError: Sentry.reactErrorHandler(),
  }).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})