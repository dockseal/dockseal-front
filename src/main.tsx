import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { enableMSW } from '@/api/mocks'
import { App } from '@/app'

import '@/styles/global.css'

enableMSW().then(() => {
	createRoot(document.getElementById('root')!).render(
		<StrictMode>
			<App />
		</StrictMode>,
	)
})
