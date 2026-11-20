import type { IAnalysisResult } from '@/@types/analysis'

export function buildDivergentResult(
	documents: string[] = ['bill_of_lading.pdf', 'nota_fiscal.docx'],
): IAnalysisResult {
	const [first = 'bill_of_lading.pdf', second = 'nota_fiscal.docx'] = documents

	return {
		status: 'DIVERGENTE',
		summary: 'O número do contêiner e o peso bruto divergem entre os documentos analisados.',
		documents: [
			{ document: first, identified_type: 'BILL_OF_LADING' },
			{ document: second, identified_type: 'NOTA_FISCAL' },
		],
		divergences: [
			{
				field: 'peso bruto',
				description: 'O peso bruto na Nota Fiscal (10 t) diverge do Bill of Lading (18 t).',
				occurrences: [
					{ document: first, value: '18 t', excerpt: 'Gross weight: 18.000 kg' },
					{ document: second, value: '10 t', excerpt: 'Peso bruto 10.000 kg' },
				],
				severity: 'MEDIA',
				suggestion: 'Conferir o peso bruto com a balança do terminal.',
				document_to_fix: null,
				confidence: 0.8,
			},
			{
				field: 'número do contêiner',
				description: 'O número do contêiner na Nota Fiscal (MSCU7654321) difere do Bill of Lading (MSCU1234567).',
				occurrences: [
					{ document: first, value: 'MSCU1234567', excerpt: 'Container: MSCU1234567' },
					{ document: second, value: 'MSCU7654321', excerpt: 'Contêiner MSCU7654321' },
				],
				severity: 'CRITICA',
				suggestion: 'Corrigir o número do contêiner na Nota Fiscal para MSCU1234567.',
				document_to_fix: second,
				confidence: 1,
			},
			{
				field: 'lacre',
				description: 'O lacre na Nota Fiscal é SL-884599 [?], divergente do Bill of Lading (SL-884512).',
				occurrences: [
					{ document: first, value: 'SL-884512', excerpt: 'Seal: SL-884512' },
					{ document: second, value: 'SL-884599 [?]', excerpt: null },
				],
				severity: 'ALTA',
				suggestion: 'Corrigir o lacre na Nota Fiscal para SL-884512.',
				document_to_fix: second,
				confidence: 0.7,
			},
		],
		missing_fields: [
			{
				field: 'porto de destino',
				present_in: [first],
				missing_in: [second],
				suggestion: 'Incluir o porto de destino na Nota Fiscal.',
			},
		],
		consistent_fields: ['número do BL', 'exportador', 'navio'],
		confidence: 0.95,
	}
}

export function buildConformeResult(documents: string[] = ['bill_of_lading.pdf']): IAnalysisResult {
	return {
		status: 'CONFORME',
		summary: 'Os documentos estão coerentes entre si.',
		documents: documents.map((document) => ({ document, identified_type: 'BILL_OF_LADING' })),
		divergences: [],
		missing_fields: [],
		consistent_fields: ['número do contêiner', 'peso bruto', 'lacre'],
		confidence: 0.9,
	}
}

export function buildInconclusivoResult(documents: string[] = ['documento.txt']): IAnalysisResult {
	return {
		status: 'INCONCLUSIVO',
		summary: 'Os documentos estão ilegíveis ou são de operações diferentes.',
		documents: documents.map((document) => ({ document, identified_type: 'OUTRO' })),
		divergences: [],
		missing_fields: [],
		consistent_fields: [],
		confidence: 0.3,
	}
}
