import { CONTAINER_NUMBER_PATTERN } from '@/constants/shipment'

export function normalizeContainerNumber(value: string) {
	return value.replace(/[\s-]/g, '').toUpperCase()
}

export function isValidContainerNumber(value: string) {
	return CONTAINER_NUMBER_PATTERN.test(normalizeContainerNumber(value))
}

export function formatContainerNumber(value: string) {
	const normalized = normalizeContainerNumber(value)

	if (!CONTAINER_NUMBER_PATTERN.test(normalized)) return normalized

	return `${normalized.slice(0, 4)} ${normalized.slice(4, 10)}-${normalized.slice(10)}`
}
