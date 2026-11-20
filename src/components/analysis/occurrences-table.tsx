import type { IFieldOccurrence } from '@/@types/analysis'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface IOccurrencesTableProps {
	occurrences: IFieldOccurrence[]
}

export function OccurrencesTable({ occurrences }: IOccurrencesTableProps) {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Documento</TableHead>
					<TableHead>Valor</TableHead>
					<TableHead>Trecho</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{occurrences.map((occurrence) => (
					<TableRow key={`${occurrence.document}-${occurrence.value}`}>
						<TableCell className="font-medium">{occurrence.document}</TableCell>
						<TableCell className="font-mono">{occurrence.value}</TableCell>
						<TableCell className="whitespace-normal text-muted-foreground">{occurrence.excerpt ?? '—'}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	)
}
