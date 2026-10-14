export interface IVolumeTrendPoint {
	date: string
	count: number
}

export interface IDashboardMetrics {
	shipments_in_yard: number
	average_transit_hours: number | null
	efficiency_percent: number | null
	volume_trend: IVolumeTrendPoint[]
}
