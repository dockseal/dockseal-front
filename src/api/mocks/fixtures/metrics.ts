import type { IDashboardMetrics } from '@/@types/dashboard'

export const MOCK_TREND_DAYS = 30

export function buildMetrics(): IDashboardMetrics {
	const today = new Date()
	const todayUtc = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())

	return {
		shipments_in_yard: 12,
		average_transit_hours: 36.5,
		efficiency_percent: 66.67,
		volume_trend: Array.from({ length: MOCK_TREND_DAYS }, (_, index) => {
			const date = new Date(todayUtc - (MOCK_TREND_DAYS - 1 - index) * 24 * 60 * 60 * 1000)

			return { date: date.toISOString().slice(0, 10), count: index % 4 === 0 ? 0 : (index % 7) + 1 }
		}),
	}
}
