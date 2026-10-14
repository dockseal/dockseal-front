import type { TPermission } from '@/@types/auth'
import type { TShipmentDetailTab, TShipmentStatus } from '@/@types/shipment'
import type { TTone } from '@/@types/ui'
import type { TShipmentFormValues } from '@/schemas/shipments/shipment-form.schema'

export const EShipmentStatus = {
	REGISTERED: 'REGISTERED',
	VALIDATED: 'VALIDATED',
	PENDING_REVIEW: 'PENDING_REVIEW',
} as const satisfies Record<string, TShipmentStatus>

export const SHIPMENT_STATUS_LABEL: Record<TShipmentStatus, string> = {
	REGISTERED: 'Cadastrado',
	VALIDATED: 'Validado',
	PENDING_REVIEW: 'Pendente de revisão',
}

export const SHIPMENT_STATUS_TONE: Record<TShipmentStatus, TTone> = {
	REGISTERED: 'neutral',
	VALIDATED: 'success',
	PENDING_REVIEW: 'danger',
}

export const CONTAINER_NUMBER_PATTERN = /^[A-Z]{4}\d{7}$/

export const CONTAINER_STATUS_LABEL: Record<string, string> = {
	IN_TRANSIT: 'Em trânsito',
}

export const SHIPMENT_FORM_FIELD_BY_API_FIELD: Record<string, keyof TShipmentFormValues> = {
	origin: 'origin',
	destination: 'destination',
	shipment_id_custom: 'shipmentIdCustom',
	transport_company: 'transportCompany',
	dispatched_at: 'dispatchedAt',
	expected_arrival: 'expectedArrival',
	expected_return: 'expectedReturn',
	container_number: 'containerNumber',
	iso_code: 'containerIsoCode',
	type: 'containerType',
	owner: 'containerOwner',
}

export const SHIPMENT_DETAIL_TABS = ['resumo', 'conteineres', 'documentos', 'validacao', 'historico'] as const

export const SHIPMENT_DETAIL_TAB_LABEL: Record<TShipmentDetailTab, string> = {
	resumo: 'Resumo',
	conteineres: 'Contêineres',
	documentos: 'Documentos',
	validacao: 'Validação',
	historico: 'Histórico',
}

export const SHIPMENT_DETAIL_TAB_PERMISSION: Partial<Record<TShipmentDetailTab, TPermission>> = {
	historico: 'history:read',
}
