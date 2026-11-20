import type { IProcessEvent } from '@/@types/event'
import { StatusBadge } from '@/components/feedback/status-badge'
import { EVENT_STATUS_TONE } from '@/constants/event'
import { useMe } from '@/queries/auth'
import { formatDateTime } from '@/utils/date'
import { getEventActorLabel, getEventStatusLabel, getEventStepLabel } from '@/utils/event'

interface IEventTimelineProps {
	events: IProcessEvent[]
}

export function EventTimeline({ events }: IEventTimelineProps) {
	const { data: me } = useMe()

	return (
		<ol aria-label="Linha do tempo" className="flex flex-col border-l pl-5">
			{events.map((event) => (
				<li key={event.id} className="relative flex flex-col gap-1 pb-5 last:pb-0">
					<span aria-hidden className="absolute top-1.5 -left-[25px] size-2.5 rounded-full bg-primary" />
					<div className="flex flex-wrap items-center gap-2">
						<span className="font-medium">{getEventStepLabel(event.step)}</span>
						<StatusBadge
							label={getEventStatusLabel(event.status)}
							tone={EVENT_STATUS_TONE[event.status] ?? 'neutral'}
						/>
					</div>
					{event.observation && <p className="text-sm text-muted-foreground">{event.observation}</p>}
					<p className="text-xs text-muted-foreground">
						{formatDateTime(event.created_at)} · {getEventActorLabel(event, me?.id)}
					</p>
				</li>
			))}
		</ol>
	)
}
