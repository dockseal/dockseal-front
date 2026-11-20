import { describe, expect, it } from 'vitest'

import { formatContainerNumber, isValidContainerNumber, normalizeContainerNumber } from '@/utils/container'

describe('container number', () => {
	it('normalizes spaces, hyphens and case', () => {
		expect(normalizeContainerNumber('MSCU 123456-7')).toBe('MSCU1234567')
		expect(normalizeContainerNumber(' mscu-123456 7 ')).toBe('MSCU1234567')
	})

	it('accepts lowercase input', () => {
		expect(isValidContainerNumber('mscu1234567')).toBe(true)
	})

	it('rejects three letters', () => {
		expect(isValidContainerNumber('MSC1234567')).toBe(false)
	})

	it('rejects six digits', () => {
		expect(isValidContainerNumber('MSCU123456')).toBe(false)
	})

	it('does not verify the check digit', () => {
		expect(isValidContainerNumber('MSCU1234560')).toBe(true)
		expect(isValidContainerNumber('MSCU1234569')).toBe(true)
	})

	it('formats for display', () => {
		expect(formatContainerNumber('mscu1234567')).toBe('MSCU 123456-7')
	})
})
