import type { IAlert } from '@/@types/alert'
import type { IDivergence, IValidation } from '@/@types/analysis'
import { SEVERITY_ORDER } from '@/constants/alert'

const SUGGESTION_MARKER = 'Sugestão:'

export function splitAlertDescription(description: string) {
	const separator = description.indexOf(':')
	const suggestionIndex = description.indexOf(SUGGESTION_MARKER)
	const hasField = separator > 0 && (suggestionIndex < 0 || separator < suggestionIndex)
	const field = hasField ? description.slice(0, separator).trim() : ''
	const body = hasField ? description.slice(separator + 1) : description
	const bodySuggestionIndex = body.indexOf(SUGGESTION_MARKER)

	if (bodySuggestionIndex < 0) {
		return { field, text: body.trim(), suggestion: null }
	}

	return {
		field,
		text: body.slice(0, bodySuggestionIndex).trim(),
		suggestion: body.slice(bodySuggestionIndex + SUGGESTION_MARKER.length).trim(),
	}
}

export function findAlertDivergence(alert: IAlert, validation: IValidation | undefined): IDivergence | undefined {
	if (!validation) return undefined

	const { field } = splitAlertDescription(alert.description)

	return validation.result.divergences?.find((divergence) => divergence.field === field)
}

export function sortDivergencesBySeverity(divergences: IDivergence[]) {
	return [...divergences].sort((a, b) => SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity))
}
