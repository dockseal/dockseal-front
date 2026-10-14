import { Link, useNavigate } from '@tanstack/react-router'
import { Plus, Ship } from 'lucide-react'

import { EmptyState } from '@/components/feedback/empty-state'
import { ErrorState } from '@/components/feedback/error-state'
import { LoadingState } from '@/components/feedback/loading-state'
import { PageHeader } from '@/components/page-header'
import { ShipmentsPagination } from '@/components/shipments/shipments-pagination'
import { ShipmentsTable } from '@/components/shipments/shipments-table'
import { Button } from '@/components/ui/button'
import { SHIPMENTS_PAGE_SIZE } from '@/constants/api'
import { EPermission } from '@/constants/auth'
import { usePermission } from '@/hooks/use-permission'
import { useShipments } from '@/queries/shipments'
import { getApiErrorMessage } from '@/utils/api-error'
import { hasNextPage, pageToOffset } from '@/utils/pagination'

interface IShipmentsListProps {
	page: number
}

function NewShipmentButton() {
	return (
		<Button asChild>
			<Link to="/embarques/novo">
				<Plus />
				Novo embarque
			</Link>
		</Button>
	)
}

export function ShipmentsList({ page }: IShipmentsListProps) {
	const navigate = useNavigate()
	const canWrite = usePermission(EPermission.SHIPMENT_WRITE)
	const filters = { limit: SHIPMENTS_PAGE_SIZE, offset: pageToOffset(page, SHIPMENTS_PAGE_SIZE) }

	const {
		data: shipments,
		isLoading: isLoadingShipments,
		isFetching: isFetchingShipments,
		error: shipmentsError,
		refetch: refetchShipments,
	} = useShipments(filters)

	function handlePageChange(nextPage: number) {
		navigate({ to: '/embarques', search: { page: nextPage > 1 ? nextPage : undefined } })
	}

	return (
		<>
			<PageHeader
				title="Embarques"
				description="Embarques registrados e seus contêineres."
				actions={canWrite && <NewShipmentButton />}
			/>
			{isLoadingShipments && <LoadingState rows={6} />}
			{shipmentsError && !shipments && (
				<ErrorState message={getApiErrorMessage(shipmentsError)} onRetry={() => refetchShipments()} />
			)}
			{shipments && shipments.length === 0 && page === 1 && (
				<EmptyState icon={Ship} title="Nenhum embarque registrado.">
					{canWrite && <NewShipmentButton />}
				</EmptyState>
			)}
			{shipments && (shipments.length > 0 || page > 1) && (
				<>
					<ShipmentsTable shipments={shipments} />
					<ShipmentsPagination
						page={page}
						hasNext={hasNextPage(shipments, SHIPMENTS_PAGE_SIZE)}
						isFetching={isFetchingShipments}
						onPageChange={handlePageChange}
					/>
				</>
			)}
		</>
	)
}
