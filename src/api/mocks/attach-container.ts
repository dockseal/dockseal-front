import type { IContainerInput, IShipment } from '@/@types/shipment'
import { getDb, registerMockEvent } from '@/api/mocks/db'
import { detailResponse } from '@/api/mocks/http'
import { hasScenario } from '@/api/mocks/scenario'
import { isValidContainerNumber, normalizeContainerNumber } from '@/utils/container'

export function attachMockContainer(
	shipment: IShipment,
	input: IContainerInput,
	options: { replacePrimary: boolean; userId: string },
) {
	const containerNumber = normalizeContainerNumber(input.container_number ?? '')

	if (!isValidContainerNumber(containerNumber)) {
		return detailResponse(422, 'Número de contêiner inválido. Use o padrão ISO 6346: 4 letras e 7 números.')
	}

	const db = getDb()
	const inTransitElsewhere = db.shipments.some(
		(other) =>
			other.id !== shipment.id &&
			other.returned_at === null &&
			other.containers.some((container) => container.container_number === containerNumber),
	)

	if (hasScenario('container-in-transit') || inTransitElsewhere) {
		return detailResponse(422, 'Contêiner já está em trânsito em outro embarque')
	}

	const existing = db.shipments
		.flatMap((candidate) => candidate.containers)
		.find((container) => container.container_number === containerNumber)
	const container = existing ?? {
		id: crypto.randomUUID(),
		container_number: containerNumber,
		iso_code: input.iso_code ?? null,
		type: input.type ?? null,
		owner: input.owner ?? null,
		status: 'IN_TRANSIT',
	}

	container.status = 'IN_TRANSIT'

	if (!shipment.containers.some((linked) => linked.container_number === containerNumber)) {
		shipment.containers = [...shipment.containers, container]
	}

	if (shipment.container === null || options.replacePrimary) {
		shipment.container = container
	}

	registerMockEvent({
		step: 'CONTAINER_ASSOCIATED',
		status: 'SUCCESS',
		user_id: options.userId,
		shipment_id: shipment.id,
		observation: containerNumber,
	})

	return null
}
