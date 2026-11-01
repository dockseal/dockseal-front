import { setupWorker } from 'msw/browser'

import { addShipmentContainerHandler } from '@/api/mocks/handlers/add-shipment-container'
import { analyzeDocumentsHandler } from '@/api/mocks/handlers/analyze-documents'
import { createShipmentHandler } from '@/api/mocks/handlers/create-shipment'
import { createUserHandler } from '@/api/mocks/handlers/create-user'
import { deleteUserHandler } from '@/api/mocks/handlers/delete-user'
import { getAlertsHandler } from '@/api/mocks/handlers/get-alerts'
import { getDashboardMetricsHandler } from '@/api/mocks/handlers/get-dashboard-metrics'
import { getEventsHandler } from '@/api/mocks/handlers/get-events'
import { getMeHandler } from '@/api/mocks/handlers/get-me'
import { getShipmentHandler } from '@/api/mocks/handlers/get-shipment'
import { getShipmentEventsHandler } from '@/api/mocks/handlers/get-shipment-events'
import { getShipmentValidationsHandler } from '@/api/mocks/handlers/get-shipment-validations'
import { getShipmentsHandler } from '@/api/mocks/handlers/get-shipments'
import { getUsersHandler } from '@/api/mocks/handlers/get-users'
import { loginHandler } from '@/api/mocks/handlers/login'
import { refreshSessionHandler } from '@/api/mocks/handlers/refresh-session'
import { setShipmentContainerHandler } from '@/api/mocks/handlers/set-shipment-container'
import { updateAlertHandler } from '@/api/mocks/handlers/update-alert'
import { updateUserHandler } from '@/api/mocks/handlers/update-user'
import { uploadShipmentDocumentsHandler } from '@/api/mocks/handlers/upload-shipment-documents'
import { validateShipmentHandler } from '@/api/mocks/handlers/validate-shipment'
import { env } from '@/env'

export const worker = setupWorker(
	loginHandler,
	refreshSessionHandler,
	getMeHandler,
	getShipmentsHandler,
	createShipmentHandler,
	getShipmentHandler,
	setShipmentContainerHandler,
	addShipmentContainerHandler,
	uploadShipmentDocumentsHandler,
	validateShipmentHandler,
	getShipmentValidationsHandler,
	getShipmentEventsHandler,
	analyzeDocumentsHandler,
	getAlertsHandler,
	updateAlertHandler,
	getEventsHandler,
	getDashboardMetricsHandler,
	getUsersHandler,
	createUserHandler,
	updateUserHandler,
	deleteUserHandler,
)

export async function enableMSW() {
	if (env.MODE !== 'test') {
		return
	}

	await worker.start({
		onUnhandledRequest(request, print) {
			if (request.url.startsWith(env.VITE_API_URL)) {
				print.error()
			}
		},
		serviceWorker: {
			url: '/mockServiceWorker.js',
		},
		waitUntilReady: true,
	})
}
