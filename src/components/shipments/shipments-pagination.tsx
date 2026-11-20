import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface IShipmentsPaginationProps {
	page: number
	hasNext: boolean
	isFetching: boolean
	onPageChange: (page: number) => void
}

export function ShipmentsPagination({ page, hasNext, isFetching, onPageChange }: IShipmentsPaginationProps) {
	function handlePrevious() {
		onPageChange(page - 1)
	}

	function handleNext() {
		onPageChange(page + 1)
	}

	return (
		<div className="flex items-center justify-end gap-3">
			<span className="text-sm text-muted-foreground">Página {page}</span>
			<Button type="button" variant="outline" size="sm" onClick={handlePrevious} disabled={page <= 1 || isFetching}>
				<ChevronLeft />
				Anterior
			</Button>
			<Button type="button" variant="outline" size="sm" onClick={handleNext} disabled={!hasNext || isFetching}>
				Próxima
				<ChevronRight />
			</Button>
		</div>
	)
}
