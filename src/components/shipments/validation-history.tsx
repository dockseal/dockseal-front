import type { IValidation } from '@/@types/analysis'
import { StatusBadge } from '@/components/feedback/status-badge'
import { ANALYSIS_STATUS_LABEL, ANALYSIS_STATUS_TONE } from '@/constants/analysis'
import { formatDateTime } from '@/utils/date'

interface IValidationHistoryProps {
	validations: IValidation[]
}

export function ValidationHistory({ validations }: IValidationHistoryProps) {
	return (
		<section aria-labelledby="validation-history-title" className="flex flex-col gap-3">
			<h3 id="validation-history-title" className="font-medium">
				Validações anteriores
			</h3>
			<ul className="flex flex-col divide-y rounded-lg border">
				{validations.map((validation) => (
					<li key={validation.id} className="flex flex-col gap-1 p-3 text-sm">
						<div className="flex flex-wrap items-center gap-2">
							<StatusBadge
								label={ANALYSIS_STATUS_LABEL[validation.status]}
								tone={ANALYSIS_STATUS_TONE[validation.status]}
							/>
							<span className="text-muted-foreground">{formatDateTime(validation.created_at)}</span>
						</div>
						<p>{validation.details}</p>
					</li>
				))}
			</ul>
		</section>
	)
}
