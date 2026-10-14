import type { IEvidence, IShipmentDocument } from '@/@types/document'

export type TShipmentStatus = 'REGISTERED' | 'VALIDATED' | 'PENDING_REVIEW'

export type TShipmentDetailTab = 'resumo' | 'conteineres' | 'documentos' | 'validacao' | 'historico'

export interface IContainerInput {
	container_number: string
	iso_code?: string | null
	type?: string | null
	owner?: string | null
}

export interface IContainer {
	id: string
	container_number: string
	iso_code: string | null
	type: string | null
	owner: string | null
	status: string
}

export interface ICreateShipmentInput {
	origin: string
	destination: string
	shipment_id_custom?: string | null
	transport_company?: string | null
	dispatched_at?: string | null
	expected_arrival?: string | null
	expected_return?: string | null
	container?: IContainerInput | null
}

export interface IShipment {
	id: string
	origin: string
	destination: string
	shipment_id_custom: string | null
	transport_company: string | null
	dispatched_at: string | null
	expected_arrival: string | null
	expected_return: string | null
	returned_at: string | null
	status: TShipmentStatus
	container: IContainer | null
	containers: IContainer[]
	created_at: string
}

export interface IShipmentDetail extends IShipment {
	documents: IShipmentDocument[]
	evidences: IEvidence[]
}

export interface IGetShipmentsFilters {
	limit: number
	offset: number
}
