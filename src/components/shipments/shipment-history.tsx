import { Link } from '@tanstack/react-router'

import { EventsView } from '@/components/events/events-view'
import { useShipmentEvents } from '@/queries/events'

interface IShipmentHistoryProps {
	shipmentId: string
}

export function ShipmentHistory({ shipmentId }: IShipmentHistoryProps) {
	const {
		data: shipmentEvents,
		isLoading: isLoadingShipmentEvents,
		error: shipmentEventsError,
		refetch: refetchShipmentEvents,
	} = useShipmentEvents(shipmentId)

	return (
		<div className="flex flex-col gap-4">
			<Link to="/audit" search={{ shipmentId }} className="self-end text-sm underline underline-offset-4">
				Abrir na auditoria
			</Link>
			<EventsView
				events={shipmentEvents}
				isLoading={isLoadingShipmentEvents}
				error={shipmentEventsError}
				onRetry={() => refetchShipmentEvents()}
			/>
		</div>
	)
}
