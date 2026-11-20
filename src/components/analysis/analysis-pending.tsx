import { LoaderPinwheelIcon } from 'lucide-react'

export function AnalysisPending() {
	return (
		<div role="status" className="flex items-center gap-3 rounded-lg border bg-muted/40 p-4 text-sm">
			<LoaderPinwheelIcon className="size-5 animate-spin text-primary" aria-hidden="true" />
			Analisando documentos com IA. Isso pode levar até 40 segundos.
		</div>
	)
}
