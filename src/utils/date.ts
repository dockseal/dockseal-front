const dateTimeFormatter = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' })

const dateFormatter = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' })

const trendDateFormatter = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', timeZone: 'UTC' })

export function formatDateTime(iso: string | null | undefined) {
	if (!iso) return '—'

	return dateTimeFormatter.format(new Date(iso))
}

export function formatDate(iso: string | null | undefined) {
	if (!iso) return '—'

	return dateFormatter.format(new Date(iso))
}

export function formatTrendDate(date: string) {
	return trendDateFormatter.format(new Date(`${date}T00:00:00Z`))
}

export function toIsoUtc(datetimeLocal: string | null | undefined) {
	if (!datetimeLocal) return undefined

	const date = new Date(datetimeLocal)

	if (Number.isNaN(date.getTime())) return undefined

	return date.toISOString()
}

export function startOfTodayUtc(now: Date = new Date()) {
	return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
}
