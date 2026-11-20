import { LoaderPinwheelIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { type IDeleteShipmentFileInput, useDeleteShipmentFile } from '@/mutations/shipments/delete-shipment-file'

interface IRemoveShipmentFileSheetProps {
	shipmentId: string
	target?: Pick<IDeleteShipmentFileInput, 'fileId' | 'kind'> & { label: string }
	onOpenChange: (open: boolean) => void
}

export function RemoveShipmentFileSheet({ shipmentId, target, onOpenChange }: IRemoveShipmentFileSheetProps) {
	const { mutateAsync: deleteShipmentFileFn, isPending: isDeletingFile } = useDeleteShipmentFile({
		onSuccess: () => onOpenChange(false),
	})

	async function handleDelete() {
		if (!target) return

		await deleteShipmentFileFn({
			shipmentId,
			fileId: target.fileId,
			kind: target.kind,
		}).catch(() => undefined)
	}

	return (
		<Sheet open={Boolean(target)} onOpenChange={onOpenChange}>
			<SheetContent className="flex w-full flex-col gap-0 sm:max-w-md">
				<SheetHeader>
					<SheetTitle>Remover arquivo</SheetTitle>
					<SheetDescription>
						O arquivo sai do embarque. Envie outro no lugar; arquivo vazio ou sem texto continua bloqueado.
					</SheetDescription>
				</SheetHeader>
				{target && <p className="px-4 text-sm font-medium">{target.label}</p>}
				<SheetFooter className="flex-row justify-end">
					<Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
						Cancelar
					</Button>
					<Button type="button" variant="destructive" disabled={isDeletingFile} onClick={handleDelete}>
						{isDeletingFile && <LoaderPinwheelIcon className="size-4 animate-spin" />}
						Remover arquivo
					</Button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	)
}
