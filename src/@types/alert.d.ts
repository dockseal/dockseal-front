import type { TSeverity } from '@/@types/analysis'

export type TAlertStatus = 'OPEN' | 'RESOLVED' | 'CLOSED' | 'DISMISSED'

export interface IAlert {
	id: string
	severity: TSeverity
	description: string
	status: TAlertStatus
	resolution_note: string | null
	shipment_id: string | null
	validation_id: string | null
	created_at: string
	updated_at: string
}

export interface IUpdateAlertInput {
	status: TAlertStatus
	resolution_note?: string | null
}

export interface IGetAlertsFilters {
	status?: TAlertStatus
	severity?: TSeverity
	shipment_id?: string
}
