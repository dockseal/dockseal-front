import { X } from 'lucide-react'
import { useState } from 'react'

import type { IShipment } from '@/@types/shipment'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverAnchor, PopoverContent } from '@/components/ui/popover'
import { ALERT_SHIPMENT_SEARCH_DEBOUNCE_MS, ALERT_SHIPMENT_SEARCH_LIMIT } from '@/constants/alert'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { useShipment, useShipments } from '@/queries/shipments'

function shipmentIdentifier(shipment: Pick<IShipment, 'id' | 'shipment_id_custom'>) {
	return shipment.shipment_id_custom || shipment.id
}

interface IShipmentAlertFilterProps {
	shipmentId?: string
	onShipmentChange: (shipmentId: string | undefined) => void
}

export function ShipmentAlertFilter({ shipmentId, onShipmentChange }: IShipmentAlertFilterProps) {
	const { data: selectedShipment } = useShipment(shipmentId ?? '', Boolean(shipmentId))
	const [query, setQuery] = useState('')
	const [isEditing, setIsEditing] = useState(false)
	const debouncedQuery = useDebouncedValue(query, ALERT_SHIPMENT_SEARCH_DEBOUNCE_MS)
	const search = isEditing ? debouncedQuery.trim() : ''
	const {
		data: shipments,
		isFetching,
		isError,
	} = useShipments({ limit: ALERT_SHIPMENT_SEARCH_LIMIT, offset: 0, search }, search.length > 0)
	const visibleShipments = (shipments ?? []).filter((shipment) =>
		shipment.shipment_id_custom?.trim().toLocaleLowerCase().startsWith(search.toLocaleLowerCase()),
	)
	const showLoading = isFetching && visibleShipments.length === 0
	const selectedLabel = selectedShipment ? shipmentIdentifier(selectedShipment) : ''
	const inputValue = isEditing ? query : selectedLabel
	const isOpen = isEditing && search.length > 0
	const canClear = Boolean(shipmentId) || (isEditing && query.length > 0)

	function handleQueryChange(value: string) {
		setIsEditing(true)
		setQuery(value)

		if (value.trim() === '') onShipmentChange(undefined)
	}

	function handleSelect(shipment: IShipment) {
		onShipmentChange(shipment.id)
		setQuery('')
		setIsEditing(false)
	}

	function handleClear() {
		setQuery('')
		setIsEditing(false)
		onShipmentChange(undefined)
	}

	function handleOpenChange(open: boolean) {
		if (open) return

		setIsEditing(false)
		setQuery('')
	}

	return (
		<Popover open={isOpen} onOpenChange={handleOpenChange}>
			<PopoverAnchor asChild>
				<div className="relative w-72">
					<Input
						value={inputValue}
						placeholder="Identificador do embarque"
						aria-label="Embarque"
						aria-autocomplete="list"
						aria-expanded={isOpen}
						role="combobox"
						className={canClear ? 'pr-8' : undefined}
						onChange={(event) => handleQueryChange(event.target.value)}
						onFocus={() => {
							if (query.trim()) setIsEditing(true)
						}}
					/>
					{canClear && (
						<Button
							type="button"
							variant="ghost"
							size="icon-xs"
							className="absolute top-1 right-1"
							aria-label="Limpar embarque"
							onClick={handleClear}
						>
							<X />
						</Button>
					)}
				</div>
			</PopoverAnchor>
			<PopoverContent className="max-h-80 overflow-y-auto p-1" onOpenAutoFocus={(event) => event.preventDefault()}>
				{showLoading && <p className="px-2 py-1.5 text-sm text-muted-foreground">Buscando embarques...</p>}
				{isError && <p className="px-2 py-1.5 text-sm text-muted-foreground">Não foi possível buscar embarques.</p>}
				{!isError && !showLoading && visibleShipments.length === 0 && (
					<p className="px-2 py-1.5 text-sm text-muted-foreground">Nenhum embarque encontrado.</p>
				)}
				{!isError && visibleShipments.length > 0 && (
					<div role="listbox" aria-label="Embarques">
						{visibleShipments.map((shipment) => (
							<button
								key={shipment.id}
								type="button"
								role="option"
								className="flex w-full flex-col rounded-md px-2 py-1.5 text-left hover:bg-muted"
								onMouseDown={(event) => event.preventDefault()}
								onClick={() => handleSelect(shipment)}
							>
								<span className="text-sm font-medium break-all">{shipmentIdentifier(shipment)}</span>
								<span className="text-xs text-muted-foreground">
									{shipment.origin} → {shipment.destination}
								</span>
							</button>
						))}
					</div>
				)}
			</PopoverContent>
		</Popover>
	)
}
