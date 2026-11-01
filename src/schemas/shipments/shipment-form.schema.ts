import { z } from 'zod'

import { optionalContainerNumberSchema } from '@/schemas/shipments/container-number.schema'
import { addYears } from '@/utils/date'

const INVALID_DATE_MESSAGE = 'Informe uma data válida.'
const YEAR_WINDOW_MESSAGE = 'A data deve estar no máximo a 1 ano de hoje.'

function optionalText(max: number) {
	return z.string().trim().max(max, `Máximo de ${max} caracteres.`)
}

function parseDate(value: string) {
	if (!value) return undefined

	const date = new Date(value)

	return Number.isNaN(date.getTime()) ? null : date
}

export const shipmentFormSchema = z
	.object({
		shipmentIdCustom: optionalText(50),
		origin: z.string().trim().min(1, 'Informe a origem.').max(150, 'Máximo de 150 caracteres.'),
		destination: z.string().trim().min(1, 'Informe o destino.').max(150, 'Máximo de 150 caracteres.'),
		transportCompany: optionalText(150),
		dispatchedAt: z.string(),
		expectedArrival: z.string(),
		expectedReturn: z.string(),
		containerNumber: optionalContainerNumberSchema,
		containerIsoCode: optionalText(10),
		containerType: optionalText(50),
		containerOwner: optionalText(100),
	})
	.superRefine((values, context) => {
		const now = new Date()
		const earliest = addYears(now, -1).getTime()
		const latest = addYears(now, 1).getTime()
		const nowTime = now.getTime()
		const dispatched = parseDate(values.dispatchedAt)
		const arrival = parseDate(values.expectedArrival)
		const expectedReturn = parseDate(values.expectedReturn)

		function addDateIssue(path: 'dispatchedAt' | 'expectedArrival' | 'expectedReturn', message: string) {
			context.addIssue({ code: 'custom', path: [path], message })
		}

		if (dispatched === null) addDateIssue('dispatchedAt', INVALID_DATE_MESSAGE)
		if (arrival === null) addDateIssue('expectedArrival', INVALID_DATE_MESSAGE)
		if (expectedReturn === null) addDateIssue('expectedReturn', INVALID_DATE_MESSAGE)

		if (dispatched && (dispatched.getTime() < earliest || dispatched.getTime() > latest)) {
			addDateIssue('dispatchedAt', YEAR_WINDOW_MESSAGE)
		}

		if (arrival && arrival.getTime() < nowTime) {
			addDateIssue('expectedArrival', 'A chegada prevista não pode ser anterior ao horário atual.')
		} else if (arrival && arrival.getTime() > latest) {
			addDateIssue('expectedArrival', YEAR_WINDOW_MESSAGE)
		}

		if (expectedReturn && expectedReturn.getTime() < nowTime) {
			addDateIssue('expectedReturn', 'O retorno previsto não pode ser anterior ao horário atual.')
		} else if (expectedReturn && expectedReturn.getTime() > latest) {
			addDateIssue('expectedReturn', YEAR_WINDOW_MESSAGE)
		}

		if (dispatched && arrival && arrival.getTime() < dispatched.getTime()) {
			addDateIssue('expectedArrival', 'A chegada prevista não pode ser anterior ao despacho.')
		}

		if (dispatched && expectedReturn && expectedReturn.getTime() < dispatched.getTime()) {
			addDateIssue('expectedReturn', 'O retorno previsto não pode ser anterior ao despacho.')
		}

		if (arrival && expectedReturn && expectedReturn.getTime() < arrival.getTime()) {
			addDateIssue('expectedReturn', 'O retorno previsto não pode ser anterior à chegada prevista.')
		}
	})

export type TShipmentFormValues = z.infer<typeof shipmentFormSchema>
