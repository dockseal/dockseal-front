export type TDocumentType = 'BILL_OF_LADING' | 'MANIFESTO_CARGA' | 'NOTA_FISCAL' | 'ORDEM_CARREGAMENTO' | 'OUTRO'

export type TUploadDocumentType = TDocumentType | 'CONTAINER_PHOTO'

export type TEvidenceType = 'FOTO_CONTAINER' | 'FOTO_DOCUMENTO' | 'ARQUIVO_DIGITAL' | 'COMPROVANTE' | 'OUTRO'

export interface IShipmentDocument {
	id: string
	type: TDocumentType
	filename: string
	status: string
	created_at: string
}

export interface IEvidence {
	id: string
	type: TEvidenceType
	mime_type: string
	url: string
	location: string | null
	created_at: string
}

export interface IUploadFile {
	file: File
	type: TUploadDocumentType
}

export interface ISelectedUploadFile extends IUploadFile {
	id: string
}

export interface IUploadShipmentDocumentsInput {
	shipmentId: string
	files: IUploadFile[]
	onProgress?: (percent: number) => void
}
