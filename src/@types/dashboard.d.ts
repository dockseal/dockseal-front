export interface IVolumeTrendPoint {
	date: string
	count: number
}

export interface IDashboardMetrics {
	efficiency_percent: number | null
	volume_trend: IVolumeTrendPoint[]
}
