import type { IMissingField } from '@/@types/analysis'

interface IMissingFieldsListProps {
	missingFields: IMissingField[]
}

export function MissingFieldsList({ missingFields }: IMissingFieldsListProps) {
	return (
		<section aria-labelledby="missing-fields-title" className="flex flex-col gap-2">
			<h3 id="missing-fields-title" className="font-medium">
				Campos ausentes
			</h3>
			<ul className="flex flex-col gap-2">
				{missingFields.map((missing) => (
					<li key={missing.field} className="rounded-lg border p-3 text-sm">
						<p className="font-medium capitalize">{missing.field}</p>
						<p className="text-muted-foreground">
							Presente em: {missing.present_in.join(', ') || '—'} · Ausente em: {missing.missing_in.join(', ') || '—'}
						</p>
						<p>{missing.suggestion}</p>
					</li>
				))}
			</ul>
		</section>
	)
}
