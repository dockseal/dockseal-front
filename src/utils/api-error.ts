import { isAxiosError } from 'axios'

import type { IApiErrorBody, IValidationErrorItem } from '@/@types/api-error'
import {
	API_CUSTOM_MESSAGE_PREFIX,
	API_DETAIL_STATUSES,
	FIELD_ERROR_MESSAGE,
	HTTP_ERROR_MESSAGE,
} from '@/constants/api-errors'

function getErrorBody(error: unknown): IApiErrorBody | undefined {
	if (!isAxiosError(error)) return undefined

	const data: unknown = error.response?.data

	if (data && typeof data === 'object' && 'detail' in data) {
		return data as IApiErrorBody
	}

	return undefined
}

function getCustomValidationMessage(item: IValidationErrorItem) {
	if (item.type !== 'value_error' || !item.msg.startsWith(API_CUSTOM_MESSAGE_PREFIX)) return undefined

	return item.msg.slice(API_CUSTOM_MESSAGE_PREFIX.length)
}

export function getApiErrorStatus(error: unknown) {
	return isAxiosError(error) ? error.response?.status : undefined
}

export function getApiErrorMessage(error: unknown, fallback: string = HTTP_ERROR_MESSAGE.DEFAULT) {
	if (!isAxiosError(error)) return fallback

	if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') return HTTP_ERROR_MESSAGE.TIMEOUT

	const status = error.response?.status

	if (status === undefined) return HTTP_ERROR_MESSAGE.NETWORK

	if (status === 502) return HTTP_ERROR_MESSAGE[502]

	const detail = getErrorBody(error)?.detail
	const isDetailStatus = (API_DETAIL_STATUSES as readonly number[]).includes(status)

	if (isDetailStatus && typeof detail === 'string' && detail.trim()) return detail

	if (isDetailStatus && Array.isArray(detail)) {
		const customMessage = detail.map(getCustomValidationMessage).find(Boolean)

		if (customMessage) return customMessage
	}

	if (status in HTTP_ERROR_MESSAGE) {
		return HTTP_ERROR_MESSAGE[status as keyof typeof HTTP_ERROR_MESSAGE]
	}

	return fallback
}

export function getApiFieldErrors(error: unknown): Record<string, string> {
	const detail = getErrorBody(error)?.detail

	if (!Array.isArray(detail)) return {}

	return detail.reduce<Record<string, string>>((fields, item) => {
		const field = item.loc.at(-1)

		if (field !== undefined) {
			fields[String(field)] = getCustomValidationMessage(item) ?? FIELD_ERROR_MESSAGE
		}

		return fields
	}, {})
}
