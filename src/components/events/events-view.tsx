import { History } from 'lucide-react'

import type { IProcessEvent } from '@/@types/event'
import { EventTimeline } from '@/components/events/event-timeline'
import { EmptyState } from '@/components/feedback/empty-state'
import { ErrorState } from '@/components/feedback/error-state'
import { LoadingState } from '@/components/feedback/loading-state'
import { getApiErrorMessage } from '@/utils/api-error'

interface IEventsViewProps {
	events?: IProcessEvent[]
	isLoading: boolean
	error: Error | null
	onRetry: () => void
}

export function EventsView({ events, isLoading, error, onRetry }: IEventsViewProps) {
	if (isLoading) return <LoadingState rows={4} />
	if (error) return <ErrorState message={getApiErrorMessage(error)} onRetry={onRetry} />
	if (!events || events.length === 0) return <EmptyState icon={History} title="Nenhum registro encontrado." />

	return <EventTimeline events={events} />
}
