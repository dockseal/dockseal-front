import type { IEvidence, IShipmentDocument } from '@/@types/document'
import type { IContainer, IShipment, TShipmentStatus } from '@/@types/shipment'

export const MOCK_SHIPMENT_COUNT = 25

export function mockShipmentId(index: number) {
	return `a0000000-0000-4000-8000-${String(index).padStart(12, '0')}`
}

export const MOCK_CONTAINERS: IContainer[] = [
	{
		id: 'c0000000-0000-4000-8000-000000000001',
		container_number: 'MSCU1234567',
		iso_code: '22G1',
		type: "Dry 20'",
		owner: 'MSC',
		status: 'IN_TRANSIT',
	},
	{
		id: 'c0000000-0000-4000-8000-000000000002',
		container_number: 'TGHU7654321',
		iso_code: '45G1',
		type: "High Cube 40'",
		owner: 'Maersk',
		status: 'IN_TRANSIT',
	},
]

const ORIGINS = ['Porto de Santos', 'Porto de Paranaguá', 'Porto de Itajaí', 'Porto do Rio de Janeiro']
const DESTINATIONS = ['Roterdã', 'Long Beach Terminal A', 'Hamburgo', 'Xangai', 'Antuérpia']

function statusFor(index: number): TShipmentStatus {
	if (index === 1) return 'PENDING_REVIEW'
	if (index === 2) return 'VALIDATED'
	if (index === 3) return 'REGISTERED'
	const statuses: TShipmentStatus[] = ['REGISTERED', 'VALIDATED', 'PENDING_REVIEW']
	return statuses[index % statuses.length]
}

function containerFor(index: number) {
	if (index === 1) return MOCK_CONTAINERS[0]
	if (index === 2) return MOCK_CONTAINERS[1]
	return null
}

export function buildShipments(): IShipment[] {
	const now = Date.UTC(2026, 9, 10, 12, 0, 0)

	return Array.from({ length: MOCK_SHIPMENT_COUNT }, (_, position) => {
		const index = position + 1
		const container = containerFor(index)
		const createdAt = new Date(now - position * 6 * 60 * 60 * 1000)

		return {
			id: mockShipmentId(index),
			origin: ORIGINS[index % ORIGINS.length],
			destination: DESTINATIONS[index % DESTINATIONS.length],
			shipment_id_custom: `SHP-2026-${String(index).padStart(4, '0')}`,
			transport_company: index % 2 === 0 ? 'MSC' : 'Maersk',
			dispatched_at: '2026-10-03T10:00:00Z',
			expected_arrival: '2026-11-20T14:00:00Z',
			expected_return: '2026-12-03T10:00:00Z',
			returned_at: null,
			status: statusFor(index),
			container,
			containers: container ? [container] : [],
			created_at: createdAt.toISOString(),
		}
	})
}

export function buildDocuments(): Record<string, IShipmentDocument[]> {
	return {
		[mockShipmentId(1)]: [
			{
				id: 'd0000000-0000-4000-8000-000000000001',
				type: 'BILL_OF_LADING',
				filename: 'bill_of_lading.pdf',
				status: 'EXTRACTED',
				created_at: '2026-10-10T12:10:00Z',
			},
			{
				id: 'd0000000-0000-4000-8000-000000000002',
				type: 'NOTA_FISCAL',
				filename: 'nota_fiscal.docx',
				status: 'EXTRACTED',
				created_at: '2026-10-10T12:11:00Z',
			},
		],
		[mockShipmentId(2)]: [
			{
				id: 'd0000000-0000-4000-8000-000000000003',
				type: 'MANIFESTO_CARGA',
				filename: 'manifesto.txt',
				status: 'EXTRACTED',
				created_at: '2026-10-10T06:10:00Z',
			},
		],
	}
}

export function buildEvidences(): Record<string, IEvidence[]> {
	return {}
}
