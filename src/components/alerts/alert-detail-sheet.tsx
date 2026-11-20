import { X } from 'lucide-react'

import type { IAlert } from '@/@types/alert'
import { AlertDetailContent } from '@/components/alerts/alert-detail-content'
import { LoadingState } from '@/components/feedback/loading-state'
import { Button } from '@/components/ui/button'
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet'

interface IAlertDetailSheetProps {
	alertId?: string
	alert?: IAlert
	isLoading: boolean
	onClose: () => void
}

export function AlertDetailSheet({ alertId, alert, isLoading, onClose }: IAlertDetailSheetProps) {
	function handleOpenChange(open: boolean) {
		if (!open) onClose()
	}

	return (
		<Sheet open={Boolean(alertId)} onOpenChange={handleOpenChange}>
			<SheetContent showCloseButton={false} className="w-full gap-0 sm:max-w-lg">
				<SheetClose asChild>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						className="absolute top-3 right-3"
						aria-label="Fechar painel"
					>
						<X />
					</Button>
				</SheetClose>
				{alert && <AlertDetailContent alert={alert} />}
				{!alert && (
					<div className="flex flex-col gap-3 p-4">
						<SheetTitle>Alerta</SheetTitle>
						<SheetDescription>{isLoading ? 'Carregando alerta…' : 'Alerta não encontrado.'}</SheetDescription>
						{isLoading && <LoadingState />}
					</div>
				)}
			</SheetContent>
		</Sheet>
	)
}
