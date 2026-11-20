import type { IAlert } from '@/@types/alert'
import type { IValidation } from '@/@types/analysis'
import type { IUser } from '@/@types/auth'
import type { IEvidence, IShipmentDocument } from '@/@types/document'
import type { IProcessEvent } from '@/@types/event'
import type { IShipment } from '@/@types/shipment'
import { buildAlerts } from '@/api/mocks/fixtures/alerts'
import { buildEvents } from '@/api/mocks/fixtures/events'
import { buildDocuments, buildEvidences, buildShipments } from '@/api/mocks/fixtures/shipments'
import { buildUsers } from '@/api/mocks/fixtures/users'
import { buildValidations } from '@/api/mocks/fixtures/validations'

interface IMockDb {
	users: IUser[]
	shipments: IShipment[]
	documents: Record<string, IShipmentDocument[]>
	evidences: Record<string, IEvidence[]>
	validations: Record<string, IValidation[]>
	alerts: IAlert[]
	events: IProcessEvent[]
	consumedOnce: Set<string>
}

function createDb(): IMockDb {
	return {
		users: buildUsers(),
		shipments: buildShipments(),
		documents: buildDocuments(),
		evidences: buildEvidences(),
		validations: buildValidations(),
		alerts: buildAlerts(),
		events: buildEvents(),
		consumedOnce: new Set(),
	}
}

let db = createDb()

export function getDb() {
	return db
}

export function resetDb() {
	db = createDb()
}

export function registerMockEvent(
	event: Omit<IProcessEvent, 'id' | 'created_at' | 'observation'> & { observation?: string },
) {
	db.events.unshift({
		id: crypto.randomUUID(),
		observation: null,
		created_at: new Date().toISOString(),
		...event,
	})
}
