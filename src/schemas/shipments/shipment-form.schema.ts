import { z } from 'zod'

import { optionalContainerNumberSchema } from '@/schemas/shipments/container-number.schema'
import { startOfTodayUtc } from '@/utils/date'

function optionalText(max: number) {
	return z.string().trim().max(max, `Máximo de ${max} caracteres.`)
}

function toTime(value: string) {
	return value ? new Date(value).getTime() : Number.NaN
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
		const arrival = toTime(values.expectedArrival)

		if (!Number.isNaN(arrival) && arrival < startOfTodayUtc().getTime()) {
			context.addIssue({
				code: 'custom',
				path: ['expectedArrival'],
				message: 'A chegada prevista não pode ser anterior a hoje.',
			})
		}

		const dispatched = toTime(values.dispatchedAt)
		const expectedReturn = toTime(values.expectedReturn)

		if (!Number.isNaN(dispatched) && !Number.isNaN(expectedReturn) && expectedReturn < dispatched) {
			context.addIssue({
				code: 'custom',
				path: ['expectedReturn'],
				message: 'O retorno previsto não pode ser anterior ao despacho.',
			})
		}
	})

export type TShipmentFormValues = z.infer<typeof shipmentFormSchema>
