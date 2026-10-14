import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { shipmentFormSchema, type TShipmentFormValues } from '@/schemas/shipments/shipment-form.schema'
import { toCreateShipmentInput } from '@/utils/shipment'

function toDatetimeLocal(date: Date) {
	const pad = (value: number) => String(value).padStart(2, '0')

	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function buildValues(overrides: Partial<TShipmentFormValues> = {}): TShipmentFormValues {
	return {
		shipmentIdCustom: '',
		origin: 'Porto de Santos',
		destination: 'Roterdã',
		transportCompany: '',
		dispatchedAt: '',
		expectedArrival: '',
		expectedReturn: '',
		containerNumber: '',
		containerIsoCode: '',
		containerType: '',
		containerOwner: '',
		...overrides,
	}
}

function messages(values: TShipmentFormValues) {
	const result = shipmentFormSchema.safeParse(values)

	return result.success ? [] : result.error.issues.map((issue) => issue.message)
}

describe('shipmentFormSchema', () => {
	beforeEach(() => {
		vi.useFakeTimers()
		vi.setSystemTime(new Date('2026-10-14T12:00:00Z'))
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('exige origem e destino', () => {
		const result = messages(buildValues({ origin: ' ', destination: '' }))

		expect(result).toContain('Informe a origem.')
		expect(result).toContain('Informe o destino.')
	})

	it('limita identificador a 50 e transportadora a 150 caracteres', () => {
		const result = messages(buildValues({ shipmentIdCustom: 'x'.repeat(51), transportCompany: 'x'.repeat(151) }))

		expect(result).toContain('Máximo de 50 caracteres.')
		expect(result).toContain('Máximo de 150 caracteres.')
		expect(messages(buildValues({ shipmentIdCustom: 'x'.repeat(50), transportCompany: 'x'.repeat(150) }))).toEqual([])
	})

	it('rejeita chegada prevista ontem', () => {
		const yesterday = toDatetimeLocal(new Date('2026-10-13T12:00:00Z'))

		expect(messages(buildValues({ expectedArrival: yesterday }))).toContain(
			'A chegada prevista não pode ser anterior a hoje.',
		)
	})

	it('aceita chegada prevista hoje às 00:30 UTC', () => {
		const today = toDatetimeLocal(new Date('2026-10-14T00:30:00Z'))

		expect(messages(buildValues({ expectedArrival: today }))).toEqual([])
	})

	it('rejeita retorno antes do despacho', () => {
		const result = messages(
			buildValues({
				dispatchedAt: toDatetimeLocal(new Date('2026-10-20T10:00:00Z')),
				expectedReturn: toDatetimeLocal(new Date('2026-10-19T10:00:00Z')),
			}),
		)

		expect(result).toContain('O retorno previsto não pode ser anterior ao despacho.')
	})

	it('rejeita contêiner inválido', () => {
		expect(messages(buildValues({ containerNumber: 'MSC123' }))).toContain(
			'Use o padrão ISO 6346: 4 letras e 7 números.',
		)
	})

	it('aceita contêiner com espaço e hífen', () => {
		expect(messages(buildValues({ containerNumber: 'mscu 123456-7' }))).toEqual([])
	})
})

describe('toCreateShipmentInput', () => {
	it('omite vazios e não envia contêiner sem número', () => {
		const input = toCreateShipmentInput(buildValues({ containerIsoCode: '22G1' }))

		expect(input).toEqual({ origin: 'Porto de Santos', destination: 'Roterdã' })
	})

	it('gera datas ISO com Z e envia o contêiner normalizado', () => {
		const input = toCreateShipmentInput(
			buildValues({
				shipmentIdCustom: 'SHP-1',
				expectedArrival: '2026-11-20T11:00',
				containerNumber: 'mscu 123456-7',
				containerOwner: 'MSC',
			}),
		)

		expect(input.shipment_id_custom).toBe('SHP-1')
		expect(input.expected_arrival).toMatch(/Z$/)
		expect(input.container).toEqual({ container_number: 'MSCU1234567', owner: 'MSC' })
	})
})
