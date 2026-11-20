import { LoaderPinwheelIcon } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileDropzone } from '@/components/uploads/file-dropzone'
import { useUploadSelection } from '@/hooks/use-upload-selection'
import { useUploadShipmentDocuments } from '@/mutations/shipments/upload-shipment-documents'

interface IShipmentDocumentsUploadProps {
	shipmentId: string
}

export function ShipmentDocumentsUpload({ shipmentId }: IShipmentDocumentsUploadProps) {
	const { selectedFiles, errors, canSubmit, addFiles, removeFile, setFileType, clearFiles } = useUploadSelection()
	const [progress, setProgress] = useState<number | null>(null)

	const { mutateAsync: uploadShipmentDocumentsFn, isPending: isUploading } = useUploadShipmentDocuments({
		onSuccess: () => clearFiles(),
		onSettled: () => setProgress(null),
	})

	async function handleUpload() {
		setProgress(0)
		await uploadShipmentDocumentsFn({
			shipmentId,
			files: selectedFiles.map(({ file, type }) => ({ file, type })),
			onProgress: setProgress,
		}).catch(() => undefined)
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Enviar documentos</CardTitle>
				<CardDescription>
					Informe o tipo de cada arquivo. Fotos do contêiner são guardadas como evidência.
				</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col gap-4">
				<FileDropzone
					selectedFiles={selectedFiles}
					errors={errors}
					withTypes
					disabled={isUploading}
					progress={progress}
					onAddFiles={addFiles}
					onRemoveFile={removeFile}
					onTypeChange={setFileType}
				/>
				<div className="flex justify-end">
					<Button type="button" onClick={handleUpload} disabled={!canSubmit || isUploading}>
						{isUploading && <LoaderPinwheelIcon className="size-4 animate-spin" />}
						Enviar documentos
					</Button>
				</div>
			</CardContent>
		</Card>
	)
}
