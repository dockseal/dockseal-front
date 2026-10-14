import { FileText } from 'lucide-react'

import type { IShipmentDetail } from '@/@types/shipment'
import { EmptyState } from '@/components/feedback/empty-state'
import { ShipmentDocumentsUpload } from '@/components/shipments/shipment-documents-upload'
import { ShipmentEvidences } from '@/components/shipments/shipment-evidences'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { EPermission } from '@/constants/auth'
import { DOCUMENT_STATUS_LABEL, DOCUMENT_TYPE_LABEL } from '@/constants/document'
import { usePermission } from '@/hooks/use-permission'
import { formatDateTime } from '@/utils/date'

interface IShipmentDocumentsProps {
	shipment: IShipmentDetail
}

export function ShipmentDocuments({ shipment }: IShipmentDocumentsProps) {
	const canUpload = usePermission(EPermission.DOCUMENT_UPLOAD)

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
								</TableRow>
							</TableHeader>
							<TableBody>
								{shipment.documents.map((document) => (
									<TableRow key={document.id}>
										<TableCell className="font-medium">{document.filename}</TableCell>
										<TableCell>{DOCUMENT_TYPE_LABEL[document.type] ?? document.type}</TableCell>
										<TableCell>{DOCUMENT_STATUS_LABEL[document.status] ?? document.status}</TableCell>
										<TableCell>{formatDateTime(document.created_at)}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>
			<ShipmentEvidences evidences={shipment.evidences} />
		</div>
	)
}
