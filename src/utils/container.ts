import {
	CONTAINER_NUMBER_DIGITS,
	CONTAINER_NUMBER_FORMAT_MESSAGE,
	CONTAINER_NUMBER_LETTERS,
	CONTAINER_NUMBER_PATTERN,
	CONTAINER_NUMBER_SERIAL_DIGITS,
} from '@/constants/shipment'

const CHECK_DIGIT_BASE = 11

const PREFIX_LENGTH = CONTAINER_NUMBER_LETTERS + CONTAINER_NUMBER_SERIAL_DIGITS

// A=10, B=12, C=13... : a norma ISO 6346 pula os múltiplos de 11 (11, 22 e 33).
const LETTER_VALUES = (() => {
	const values: Record<string, number> = {}
	let value = 10

	for (const letter of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') {
		if (value % CHECK_DIGIT_BASE === 0) value += 1

		values[letter] = value
		value += 1
	}

	return values
})()

export function normalizeContainerNumber(value: string) {
	return value.replace(/[\s-]/g, '').toUpperCase()
}

function hasContainerNumberFormat(normalized: string) {
	return CONTAINER_NUMBER_PATTERN.test(normalized)
}

export function getContainerCheckDigit(prefix: string) {
	const total = Array.from(prefix.slice(0, PREFIX_LENGTH)).reduce((sum, char, position) => {
		const value = /[A-Z]/.test(char) ? LETTER_VALUES[char] : Number(char)

		return sum + value * 2 ** position
	}, 0)

	return (total % CHECK_DIGIT_BASE) % 10
}

export function getContainerNumberError(value: string) {
	const normalized = normalizeContainerNumber(value)

	if (!hasContainerNumberFormat(normalized)) return CONTAINER_NUMBER_FORMAT_MESSAGE

	const prefix = normalized.slice(0, PREFIX_LENGTH)
	const expected = getContainerCheckDigit(prefix)

	if (Number(normalized[PREFIX_LENGTH]) !== expected) {
		return `Dígito verificador inválido. O correto para ${prefix} é ${expected}.`
	}

	return null
}

export function isValidContainerNumber(value: string) {
	return getContainerNumberError(value) === null
}

export function maskContainerNumber(value: string) {
	let letters = ''
	let digits = ''

	for (const char of value.toUpperCase()) {
		if (letters.length < CONTAINER_NUMBER_LETTERS) {
			if (/[A-Z]/.test(char)) letters += char

			continue
		}

		if (digits.length < CONTAINER_NUMBER_DIGITS && /\d/.test(char)) digits += char
	}

	if (digits === '') return letters

	const serial = digits.slice(0, CONTAINER_NUMBER_SERIAL_DIGITS)
	const checkDigit = digits.slice(CONTAINER_NUMBER_SERIAL_DIGITS)

	return `${letters} ${serial}${checkDigit && `-${checkDigit}`}`
}

export function formatContainerNumber(value: string) {
	const normalized = normalizeContainerNumber(value)

	if (!hasContainerNumberFormat(normalized)) return normalized

	return maskContainerNumber(normalized)
}
