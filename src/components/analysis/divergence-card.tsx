import type { IDivergence } from '@/@types/analysis'
import { OccurrencesTable } from '@/components/analysis/occurrences-table'
import { StatusBadge } from '@/components/feedback/status-badge'
import { SEVERITY_LABEL, SEVERITY_TONE } from '@/constants/alert'
import { formatPercent } from '@/utils/number'

interface IDivergenceCardProps {
	divergence: IDivergence
}

export function DivergenceCard({ divergence }: IDivergenceCardProps) {
	return (
		<article aria-label={`Divergência: ${divergence.field}`} className="flex flex-col gap-3 rounded-lg border p-4">
			<header className="flex flex-wrap items-center justify-between gap-2">
				<h4 className="font-medium capitalize">{divergence.field}</h4>
				<div className="flex items-center gap-2">
					<StatusBadge label={SEVERITY_LABEL[divergence.severity]} tone={SEVERITY_TONE[divergence.severity]} />
					<span className="text-xs text-muted-foreground">Confiança: {formatPercent(divergence.confidence)}</span>
				</div>
			</header>
			<p className="text-sm">{divergence.description}</p>
			{divergence.occurrences.length > 0 && <OccurrencesTable occurrences={divergence.occurrences} />}
			<div className="flex flex-col gap-1 text-sm">
				<p>
					<span className="font-medium">Sugestão:</span> {divergence.suggestion}
				</p>
				<p className="text-muted-foreground">
					{divergence.document_to_fix ? `Corrigir em: ${divergence.document_to_fix}` : 'Requer conferência humana'}
				</p>
			</div>
		</article>
	)
}
