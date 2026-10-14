import { AxiosError, AxiosHeaders, type AxiosResponse } from 'axios'
import { describe, expect, it } from 'vitest'

import { HTTP_ERROR_MESSAGE } from '@/constants/api-errors'
import { getApiErrorMessage, getApiErrorStatus, getApiFieldErrors } from '@/utils/api-error'

function buildError(status: number | undefined, data?: unknown, code?: string) {
	const config = { headers: new AxiosHeaders() }
	const response =
		status === undefined
			? undefined
			: ({ status, data, statusText: '', headers: {}, config } as unknown as AxiosResponse)

	return new AxiosError('falha', code, config, undefined, response)
}

describe('getApiErrorMessage', () => {
	it('returns the API detail string as is', () => {
		const error = buildError(422, { detail: 'Identificador de embarque já cadastrado' })

		expect(getApiErrorMessage(error)).toBe('Identificador de embarque já cadastrado')
	})

	it('uses the 502 constant even when detail exists', () => {
		const error = buildError(502, { detail: 'Falha ao analisar os documentos com a IA: timeout' })

		expect(getApiErrorMessage(error)).toBe(HTTP_ERROR_MESSAGE[502])
	})

	it('uses NETWORK when there is no response', () => {
		expect(getApiErrorMessage(buildError(undefined, undefined, 'ERR_NETWORK'))).toBe(HTTP_ERROR_MESSAGE.NETWORK)
	})

	it('uses TIMEOUT for ECONNABORTED', () => {
		expect(getApiErrorMessage(buildError(undefined, undefined, 'ECONNABORTED'))).toBe(HTTP_ERROR_MESSAGE.TIMEOUT)
	})

	it('falls back to the status constant when detail is a list', () => {
		const error = buildError(422, { detail: [{ loc: ['body', 'origin'], msg: 'x', type: 'missing' }] })

		expect(getApiErrorMessage(error)).toBe(HTTP_ERROR_MESSAGE[422])
	})

	it('returns the fallback for non Axios errors', () => {
		expect(getApiErrorMessage(new Error('x'), 'Padrão')).toBe('Padrão')
	})
})

describe('getApiFieldErrors', () => {
	it('maps detail list to fields', () => {
		const error = buildError(422, {
			detail: [
				{ loc: ['body', 'origin'], msg: 'Field required', type: 'missing' },
				{ loc: ['body', 'container', 'container_number'], msg: 'bad', type: 'value_error' },
			],
		})

		expect(getApiFieldErrors(error)).toEqual({ origin: 'Valor inválido', container_number: 'Valor inválido' })
	})

	it('returns an empty map for string detail', () => {
		expect(getApiFieldErrors(buildError(422, { detail: 'x' }))).toEqual({})
	})
})

describe('getApiErrorStatus', () => {
	it('returns the response status', () => {
		expect(getApiErrorStatus(buildError(404, { detail: 'x' }))).toBe(404)
	})
})
