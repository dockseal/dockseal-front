import { Images } from 'lucide-react'

import type { IEvidence } from '@/@types/document'
import { EmptyState } from '@/components/feedback/empty-state'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EVIDENCE_TYPE_LABEL } from '@/constants/document'
import { formatDateTime } from '@/utils/date'

interface IShipmentEvidencesProps {
	evidences: IEvidence[]
}

export function ShipmentEvidences({ evidences }: IShipmentEvidencesProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Evidências</CardTitle>
			</CardHeader>
			<CardContent>
				{evidences.length === 0 ? (
					<EmptyState icon={Images} title="Nenhuma evidência registrada." />
				) : (
					<ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{evidences.map((evidence) => {
							const label = EVIDENCE_TYPE_LABEL[evidence.type] ?? evidence.type

							return (
								<li key={evidence.id} className="flex flex-col gap-2 rounded-lg border p-3">
									{evidence.mime_type.startsWith('image/') ? (
										<img
											src={evidence.url}
											alt={`Evidência: ${label}`}
											className="h-32 w-full rounded-md bg-muted object-contain"
										/>
									) : (
										<a href={evidence.url} target="_blank" rel="noreferrer" className="text-sm underline">
											Abrir arquivo
										</a>
									)}
									<span className="text-sm font-medium">{label}</span>
									<span className="text-xs text-muted-foreground">{formatDateTime(evidence.created_at)}</span>
								</li>
							)
						})}
					</ul>
				)}
			</CardContent>
		</Card>
	)
}
