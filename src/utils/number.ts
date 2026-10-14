const NO_DATA = 'Sem dados'

export function formatPercent(ratio: number) {
	return `${Math.round(ratio * 100)}%`
}

export function formatPercentValue(value: number | null | undefined) {
	if (value === null || value === undefined) return NO_DATA

	return `${Math.round(value)}%`
}

export function formatHours(value: number | null | undefined) {
	if (value === null || value === undefined) return NO_DATA

	return `${value.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} h`
}
