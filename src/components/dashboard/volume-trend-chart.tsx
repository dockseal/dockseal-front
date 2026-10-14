import type { IVolumeTrendPoint } from '@/@types/dashboard'
import { formatTrendDate } from '@/utils/date'

const CHART_HEIGHT = 120
const BAR_WIDTH = 8
const BAR_GAP = 4

interface IVolumeTrendChartProps {
	points: IVolumeTrendPoint[]
}

export function VolumeTrendChart({ points }: IVolumeTrendChartProps) {
	const maxCount = Math.max(1, ...points.map((point) => point.count))
	const width = points.length * (BAR_WIDTH + BAR_GAP)

	return (
		<div className="flex flex-col gap-2">
			<svg
				role="img"
				aria-label={`Embarques criados nos últimos ${points.length} dias`}
				viewBox={`0 0 ${width} ${CHART_HEIGHT}`}
				preserveAspectRatio="none"
				className="h-32 w-full"
			>
				{points.map((point, index) => {
					const height = Math.max(2, (point.count / maxCount) * CHART_HEIGHT)

					return (
						<rect
							key={point.date}
							data-testid="trend-bar"
							x={index * (BAR_WIDTH + BAR_GAP)}
							y={CHART_HEIGHT - height}
							width={BAR_WIDTH}
							height={height}
							rx={2}
							fill="var(--chart-1)"
						>
							<title>{`${formatTrendDate(point.date)}: ${point.count}`}</title>
						</rect>
					)
				})}
			</svg>
			{points.length > 0 && (
				<div className="flex justify-between text-xs text-muted-foreground">
					<span>{formatTrendDate(points[0].date)}</span>
					<span>{formatTrendDate(points[points.length - 1].date)}</span>
				</div>
			)}
		</div>
	)
}
