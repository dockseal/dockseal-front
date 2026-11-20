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

export function addYears(date: Date, years: number) {
	const next = new Date(date.getTime())

	next.setFullYear(next.getFullYear() + years)

	return next
}

export function toDatetimeLocalInput(date: Date) {
	const pad = (value: number) => String(value).padStart(2, '0')

	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function shipmentDateInputBounds(now: Date = new Date()) {
	const earliest = toDatetimeLocalInput(addYears(now, -1))
	const latest = toDatetimeLocalInput(addYears(now, 1))
	const current = toDatetimeLocalInput(now)

	return {
		dispatchedAt: { min: earliest, max: latest },
		expectedArrival: { min: current, max: latest },
		expectedReturn: { min: current, max: latest },
	}
}
