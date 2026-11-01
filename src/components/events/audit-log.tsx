import { Link } from '@tanstack/react-router'

import { EventsView } from '@/components/events/events-view'
import { PageHeader } from '@/components/page-header'
import { EVENTS_LIMIT } from '@/constants/api'
import { useEvents } from '@/queries/events'

interface IAuditLogProps {
	shipmentId?: string
}

export function AuditLog({ shipmentId }: IAuditLogProps) {
	const {
		data: events,
		isLoading: isLoadingEvents,
		error: eventsError,
		refetch: refetchEvents,
	} = useEvents({ shipment_id: shipmentId, limit: EVENTS_LIMIT })

	return (
		<>
			<PageHeader title="Auditoria" description={`Últimos ${EVENTS_LIMIT} registros do processo.`} />
			{shipmentId && (
				<div className="flex flex-wrap items-center gap-3 rounded-lg border bg-muted/40 px-4 py-3 text-sm">
					<span>
						Filtrando pelo embarque <span className="font-mono">{shipmentId.slice(0, 8)}</span>
					</span>
					<Link to="/audit" search={{}} className="underline underline-offset-4">
						Limpar filtro
					</Link>
				</div>
			)}
			<EventsView events={events} isLoading={isLoadingEvents} error={eventsError} onRetry={() => refetchEvents()} />
		</>
	)
}
