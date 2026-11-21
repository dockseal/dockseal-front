import { describe, expect, it } from 'vitest'

import {
	formatContainerNumber,
	getContainerCheckDigit,
	getContainerNumberError,
	isValidContainerNumber,
	maskContainerNumber,
	normalizeContainerNumber,
} from '@/utils/container'

const VALID_NUMBERS = [
	'CSQU3054383',
	'MSCU1234566',
	'MSCU7742121',
	'MSCU7742137',
	'MSCU7742142',
	'MSCU7654329',
	'TGHU7654320',
	'ABCU1234560',
	'ABCU7654323',
	'DKSU4829158',
]

describe('container number', () => {
	it('normalizes spaces, hyphens and case', () => {
		expect(normalizeContainerNumber('MSCU 123456-6')).toBe('MSCU1234566')
		expect(normalizeContainerNumber(' mscu-123456 6 ')).toBe('MSCU1234566')
	})

	it('accepts lowercase input with a valid check digit', () => {
		expect(isValidContainerNumber('mscu1234566')).toBe(true)
	})

	it('rejects three letters', () => {
		expect(isValidContainerNumber('MSC1234566')).toBe(false)
		expect(getContainerNumberError('MSC1234566')).toBe('Use o padrão ISO 6346: 4 letras e 7 números.')
	})

	it('rejects six digits', () => {
		expect(isValidContainerNumber('MSCU123456')).toBe(false)
	})

	it.each(VALID_NUMBERS)('accepts %s (valid ISO 6346 check digit)', (number) => {
		expect(getContainerNumberError(number)).toBeNull()
	})

	it('computes the reference check digit from the ISO 6346 algorithm', () => {
		expect(getContainerCheckDigit('CSQU305438')).toBe(3)
		expect(getContainerCheckDigit('MSCU123456')).toBe(6)
		expect(getContainerCheckDigit('DKSU482915')).toBe(8)
	})

	it('treats a remainder of 10 as check digit 0', () => {
		// TGHU765432: soma mod 11 = 10, que a norma converte em 0.
		expect(getContainerCheckDigit('TGHU765432')).toBe(0)
	})

	it('rejects a wrong check digit and tells the correct one', () => {
		expect(isValidContainerNumber('MSCU1234567')).toBe(false)
		expect(getContainerNumberError('MSCU1234567')).toBe('Dígito verificador inválido. O correto para MSCU123456 é 6.')
		expect(getContainerNumberError('DKSU 482915-2')).toBe('Dígito verificador inválido. O correto para DKSU482915 é 8.')
	})

	it('has exactly one valid check digit per prefix', () => {
		const valid = Array.from({ length: 10 }, (_, digit) => `MSCU123456${digit}`).filter(isValidContainerNumber)

		expect(valid).toEqual(['MSCU1234566'])
	})

	it('formats for display', () => {
		expect(formatContainerNumber('mscu1234566')).toBe('MSCU 123456-6')
	})

	it('does not format invalid shapes', () => {
		expect(formatContainerNumber('msc 12')).toBe('MSC12')
	})
})

describe('maskContainerNumber', () => {
	it('masks progressively while typing', () => {
		expect(maskContainerNumber('m')).toBe('M')
		expect(maskContainerNumber('msc')).toBe('MSC')
		expect(maskContainerNumber('mscu')).toBe('MSCU')
		expect(maskContainerNumber('mscu1')).toBe('MSCU 1')
		expect(maskContainerNumber('mscu123456')).toBe('MSCU 123456')
		expect(maskContainerNumber('mscu1234566')).toBe('MSCU 123456-6')
	})

	it('drops digits typed in the letter positions and letters in the digit positions', () => {
		expect(maskContainerNumber('12ms')).toBe('MS')
		expect(maskContainerNumber('mscu12ab34')).toBe('MSCU 1234')
	})

	it('cuts the excess', () => {
		expect(maskContainerNumber('mscu123456678999')).toBe('MSCU 123456-6')
		expect(maskContainerNumber('mscux1234566')).toBe('MSCU 123456-6')
	})

	it('accepts pasted values with spaces and hyphens', () => {
		expect(maskContainerNumber('MSCU-123456 6')).toBe('MSCU 123456-6')
		expect(maskContainerNumber('  mscu 123456-6  ')).toBe('MSCU 123456-6')
	})

	it('is idempotent', () => {
		const masked = maskContainerNumber('mscu1234566')

		expect(maskContainerNumber(masked)).toBe(masked)
	})

	it('removes the separators when the user deletes back to the letters', () => {
		expect(maskContainerNumber('MSCU ')).toBe('MSCU')
		expect(maskContainerNumber('MSCU 123456-')).toBe('MSCU 123456')
	})

	it('returns an empty string for input without letters or digits', () => {
		expect(maskContainerNumber('  --  ')).toBe('')
	})

	it('produces the value the API receives once normalized', () => {
		expect(normalizeContainerNumber(maskContainerNumber('csqu3054383'))).toBe('CSQU3054383')
	})
})
