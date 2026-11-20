import type { TDocumentType, TEvidenceType, TUploadDocumentType } from '@/@types/document'

export const EDocumentType = {
	BILL_OF_LADING: 'BILL_OF_LADING',
	MANIFESTO_CARGA: 'MANIFESTO_CARGA',
	NOTA_FISCAL: 'NOTA_FISCAL',
	ORDEM_CARREGAMENTO: 'ORDEM_CARREGAMENTO',
	OUTRO: 'OUTRO',
} as const satisfies Record<string, TDocumentType>

export const EUploadDocumentType = {
	...EDocumentType,
	CONTAINER_PHOTO: 'CONTAINER_PHOTO',
} as const satisfies Record<string, TUploadDocumentType>

export const DOCUMENT_TYPE_LABEL: Record<TDocumentType, string> = {
	BILL_OF_LADING: 'Bill of Lading',
	MANIFESTO_CARGA: 'Manifesto de Carga',
	NOTA_FISCAL: 'Nota Fiscal',
	ORDEM_CARREGAMENTO: 'Ordem de Carregamento',
	OUTRO: 'Outro',
}

export const UPLOAD_DOCUMENT_TYPE_LABEL: Record<TUploadDocumentType, string> = {
	...DOCUMENT_TYPE_LABEL,
	CONTAINER_PHOTO: 'Foto do contêiner',
}

export const EVIDENCE_TYPE_LABEL: Record<TEvidenceType, string> = {
	FOTO_CONTAINER: 'Foto do contêiner',
	FOTO_DOCUMENTO: 'Foto de documento',
	ARQUIVO_DIGITAL: 'Arquivo digital',
	COMPROVANTE: 'Comprovante',
	OUTRO: 'Outro',
}

export const DOCUMENT_STATUS_LABEL: Record<string, string> = {
	EXTRACTED: 'Texto extraído',
}
