import { FileText } from 'lucide-react'
import { useState } from 'react'

import type { IShipmentDetail } from '@/@types/shipment'
import { EmptyState } from '@/components/feedback/empty-state'
import { RemoveShipmentFileSheet } from '@/components/shipments/remove-shipment-file-sheet'
import { ShipmentDocumentsUpload } from '@/components/shipments/shipment-documents-upload'
import { ShipmentEvidences } from '@/components/shipments/shipment-evidences'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { EPermission } from '@/constants/auth'
import { DOCUMENT_STATUS_LABEL, DOCUMENT_TYPE_LABEL, EVIDENCE_TYPE_LABEL } from '@/constants/document'
import { usePermission } from '@/hooks/use-permission'
import type { IDeleteShipmentFileInput } from '@/mutations/shipments/delete-shipment-file'
import { formatDateTime } from '@/utils/date'

type TFileRemoval = Pick<IDeleteShipmentFileInput, 'fileId' | 'kind'> & { label: string }

interface IShipmentDocumentsProps {
	shipment: IShipmentDetail
}

export function ShipmentDocuments({ shipment }: IShipmentDocumentsProps) {
	const canUpload = usePermission(EPermission.DOCUMENT_UPLOAD)
	const [removal, setRemoval] = useState<TFileRemoval>()

	return (
		<div className="flex flex-col gap-6">
			{canUpload && <ShipmentDocumentsUpload shipmentId={shipment.id} />}
			<Card>
				<CardHeader>
					<CardTitle>Documentos</CardTitle>
				</CardHeader>
				<CardContent>
					{shipment.documents.length === 0 ? (
						<EmptyState icon={FileText} title="Nenhum documento enviado." />
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Arquivo</TableHead>
									<TableHead>Tipo</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Enviado em</TableHead>
									{canUpload && <TableHead className="text-right">Ações</TableHead>}
								</TableRow>
							</TableHeader>
							<TableBody>
								{shipment.documents.map((document) => (
									<TableRow key={document.id}>
										<TableCell className="font-medium">{document.filename}</TableCell>
										<TableCell>{DOCUMENT_TYPE_LABEL[document.type] ?? document.type}</TableCell>
										<TableCell>{DOCUMENT_STATUS_LABEL[document.status] ?? document.status}</TableCell>
										<TableCell>{formatDateTime(document.created_at)}</TableCell>
										{canUpload && (
											<TableCell className="text-right">
												<Button
													type="button"
													variant="destructive"
													size="sm"
													aria-label={`Remover ${document.filename}`}
													onClick={() =>
														setRemoval({ kind: 'document', fileId: document.id, label: document.filename })
													}
												>
													Remover
												</Button>
											</TableCell>
										)}
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>
			<ShipmentEvidences
				evidences={shipment.evidences}
				onRemove={
					canUpload
						? (evidence) =>
								setRemoval({
									kind: 'evidence',
									fileId: evidence.id,
									label: EVIDENCE_TYPE_LABEL[evidence.type] ?? evidence.type,
								})
						: undefined
				}
			/>
			<RemoveShipmentFileSheet
				shipmentId={shipment.id}
				target={removal}
				onOpenChange={(open) => {
					if (!open) setRemoval(undefined)
				}}
			/>
		</div>
	)
}
