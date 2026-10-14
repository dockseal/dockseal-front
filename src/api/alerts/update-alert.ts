import type { IAlert, IUpdateAlertInput } from '@/@types/alert'
import { api } from '@/lib/axios'

interface IUpdateAlertVariables {
	alertId: string
	input: IUpdateAlertInput
}

export async function updateAlert({ alertId, input }: IUpdateAlertVariables) {
	const response = await api.patch<IAlert>(`/alerts/${alertId}`, input)

	return response.data
}
