export type TAnalysisStatus = 'CONFORME' | 'DIVERGENTE' | 'INCONCLUSIVO'

export type TSeverity = 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA'

export interface IFieldOccurrence {
	document: string
	value: string
	excerpt?: string | null
}

export interface IDivergence {
	field: string
	description: string
	occurrences: IFieldOccurrence[]
	severity: TSeverity
	suggestion: string
	document_to_fix?: string | null
	confidence: number
}

export interface IMissingField {
	field: string
	present_in: string[]
	missing_in: string[]
	suggestion: string
}

export interface IAnalyzedDocument {
	document: string
	identified_type: string
}

export interface IAnalysisResult {
	status: TAnalysisStatus
	summary: string
	documents: IAnalyzedDocument[]
	divergences?: IDivergence[]
	missing_fields?: IMissingField[]
	consistent_fields?: string[]
	confidence: number
}

export interface IValidation {
	id: string
	status: TAnalysisStatus
	details: string
	confidence_score: number | null
	shipment_id: string | null
	result: IAnalysisResult
	created_at: string
}
