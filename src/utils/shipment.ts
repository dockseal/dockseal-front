import type { IContainerInput, ICreateShipmentInput, IShipment } from '@/@types/shipment'
import type { TContainerFormValues } from '@/schemas/shipments/container-form.schema'
import type { TShipmentFormValues } from '@/schemas/shipments/shipment-form.schema'
import { normalizeContainerNumber } from '@/utils/container'
import { toIsoUtc } from '@/utils/date'

function optional(value: string) {
	const trimmed = value.trim()

	return trimmed === '' ? undefined : trimmed
}

function withoutUndefined<T extends object>(value: T) {
	return Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== undefined)) as T
}

function buildContainerInput(number: string, isoCode: string, type: string, owner: string): IContainerInput {
	return withoutUndefined({
		container_number: normalizeContainerNumber(number),
		iso_code: optional(isoCode),
		type: optional(type),
		owner: optional(owner),
	})
}

export function toCreateShipmentInput(values: TShipmentFormValues): ICreateShipmentInput {
	const containerNumber = optional(values.containerNumber)

	return withoutUndefined({
		origin: values.origin.trim(),
		destination: values.destination.trim(),
		shipment_id_custom: optional(values.shipmentIdCustom),
		transport_company: optional(values.transportCompany),
		dispatched_at: toIsoUtc(values.dispatchedAt),
		expected_arrival: toIsoUtc(values.expectedArrival),
		expected_return: toIsoUtc(values.expectedReturn),
		container: containerNumber
			? buildContainerInput(containerNumber, values.containerIsoCode, values.containerType, values.containerOwner)
			: undefined,
	})
}

export function toContainerInput(values: TContainerFormValues) {
	return buildContainerInput(values.containerNumber, values.isoCode, values.type, values.owner)
}

export function getShipmentLabel(shipment: Pick<IShipment, 'id' | 'shipment_id_custom'>) {
	return shipment.shipment_id_custom || shipment.id.slice(0, 8)
}
