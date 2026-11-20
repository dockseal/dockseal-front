export interface IProcessEvent {
	id: string
	step: string
	status: string
	observation: string | null
	user_id: string | null
	shipment_id: string | null
	created_at: string
}

export interface IGetEventsFilters {
	shipment_id?: string
	limit?: number
}
