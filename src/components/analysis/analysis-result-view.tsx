import { CheckCircle2 } from 'lucide-react'

import type { IAnalysisResult } from '@/@types/analysis'
import { DivergenceCard } from '@/components/analysis/divergence-card'
import { MissingFieldsList } from '@/components/analysis/missing-fields-list'
import { StatusBadge } from '@/components/feedback/status-badge'
import { Badge } from '@/components/ui/badge'
import { ANALYSIS_STATUS_LABEL, ANALYSIS_STATUS_TONE } from '@/constants/analysis'
import { DOCUMENT_TYPE_LABEL } from '@/constants/document'
import { sortDivergencesBySeverity } from '@/utils/alert'
import { formatPercent } from '@/utils/number'

interface IAnalysisResultViewProps {
	result: IAnalysisResult
}

function documentTypeLabel(type: string) {
	return DOCUMENT_TYPE_LABEL[type as keyof typeof DOCUMENT_TYPE_LABEL] ?? type
}

export function AnalysisResultView({ result }: IAnalysisResultViewProps) {
	const divergences = sortDivergencesBySeverity(result.divergences ?? [])
	const missingFields = result.missing_fields ?? []
	const consistentFields = result.consistent_fields ?? []

	return (
		<div className="flex flex-col gap-5">
			<div className="flex flex-wrap items-center gap-3">
				<StatusBadge
					label={ANALYSIS_STATUS_LABEL[result.status]}
					tone={ANALYSIS_STATUS_TONE[result.status]}
					className="text-sm"
				/>
				<span className="text-sm text-muted-foreground">Confiança: {formatPercent(result.confidence)}</span>
			</div>
			<p>{result.summary}</p>

			{result.documents.length > 0 && (
				<section aria-labelledby="analyzed-documents-title" className="flex flex-col gap-2">
					<h3 id="analyzed-documents-title" className="font-medium">
						Documentos identificados
					</h3>
					<ul className="flex flex-wrap gap-2">
						{result.documents.map((document) => (
							<li key={document.document}>
								<Badge variant="secondary">
									{document.document} · {documentTypeLabel(document.identified_type)}
								</Badge>
							</li>
						))}
					</ul>
				</section>
			)}

			{divergences.length > 0 && (
				<section aria-labelledby="divergences-title" className="flex flex-col gap-3">
					<h3 id="divergences-title" className="font-medium">
						Divergências
					</h3>
					{divergences.map((divergence) => (
						<DivergenceCard key={divergence.field} divergence={divergence} />
					))}
				</section>
			)}

			{missingFields.length > 0 && <MissingFieldsList missingFields={missingFields} />}

			{consistentFields.length > 0 && (
				<section aria-labelledby="consistent-fields-title" className="flex flex-col gap-2">
					<h3 id="consistent-fields-title" className="font-medium">
						Conferido
					</h3>
					<ul className="flex flex-wrap gap-2">
						{consistentFields.map((field) => (
							<li key={field}>
								<Badge variant="outline" className="gap-1">
									<CheckCircle2 className="size-3" aria-hidden="true" />
									{field}
								</Badge>
							</li>
						))}
					</ul>
				</section>
			)}
		</div>
	)
}
