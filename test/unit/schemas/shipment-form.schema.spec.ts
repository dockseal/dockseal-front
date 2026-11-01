import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { shipmentFormSchema, type TShipmentFormValues } from '@/schemas/shipments/shipment-form.schema'
import { addYears, toDatetimeLocalInput } from '@/utils/date'
import { toCreateShipmentInput } from '@/utils/shipment'

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
		const yesterday = toDatetimeLocalInput(new Date('2026-10-13T12:00:00Z'))

		expect(messages(buildValues({ expectedArrival: yesterday }))).toContain(
			'A chegada prevista não pode ser anterior ao horário atual.',
		)
	})

	it('rejeita chegada de hoje às 00:30 quando esse instante é anterior a agora', () => {
		const today = toDatetimeLocalInput(new Date('2026-10-14T00:30:00Z'))

		expect(messages(buildValues({ expectedArrival: today }))).toContain(
			'A chegada prevista não pode ser anterior ao horário atual.',
		)
	})

	it('aceita chegada igual a agora', () => {
		expect(messages(buildValues({ expectedArrival: toDatetimeLocalInput(new Date()) }))).toEqual([])
	})

	it('rejeita chegada além de 1 ano', () => {
		const limit = addYears(new Date(), 1)

		limit.setMinutes(limit.getMinutes() + 1)

		expect(messages(buildValues({ expectedArrival: toDatetimeLocalInput(limit) }))).toContain(
			'A data deve estar no máximo a 1 ano de hoje.',
		)
	})

	it('rejeita despacho anterior a 1 ano', () => {
		const limit = addYears(new Date(), -1)

		limit.setMinutes(limit.getMinutes() - 1)

		expect(messages(buildValues({ dispatchedAt: toDatetimeLocalInput(limit) }))).toContain(
			'A data deve estar no máximo a 1 ano de hoje.',
		)
	})

	it('rejeita despacho posterior à chegada', () => {
		const arrival = new Date()

		arrival.setHours(arrival.getHours() + 1)

		const dispatched = new Date(arrival.getTime())

		dispatched.setHours(dispatched.getHours() + 1)

		expect(
			messages(
				buildValues({
					dispatchedAt: toDatetimeLocalInput(dispatched),
					expectedArrival: toDatetimeLocalInput(arrival),
				}),
			),
		).toContain('A chegada prevista não pode ser anterior ao despacho.')
	})

	it('rejeita retorno anterior à chegada', () => {
		const arrival = new Date()

		arrival.setDate(arrival.getDate() + 2)

		const expectedReturn = new Date(arrival.getTime())

		expectedReturn.setDate(expectedReturn.getDate() - 1)

		expect(
			messages(
				buildValues({
					expectedArrival: toDatetimeLocalInput(arrival),
					expectedReturn: toDatetimeLocalInput(expectedReturn),
				}),
			),
		).toContain('O retorno previsto não pode ser anterior à chegada prevista.')
	})

	it('rejeita ano ilegível', () => {
		expect(messages(buildValues({ dispatchedAt: '99999999-01-01T00:00' }))).toContain('Informe uma data válida.')
	})

	it('aceita os três campos de data vazios', () => {
		expect(messages(buildValues())).toEqual([])
	})

	it('rejeita retorno antes do despacho', () => {
		const result = messages(
			buildValues({
				dispatchedAt: toDatetimeLocalInput(new Date('2026-10-20T10:00:00Z')),
				expectedReturn: toDatetimeLocalInput(new Date('2026-10-19T10:00:00Z')),
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
