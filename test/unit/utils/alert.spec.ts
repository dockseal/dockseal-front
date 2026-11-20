import { describe, expect, it } from 'vitest'

import type { IAlert } from '@/@types/alert'
import type { IDivergence, IValidation } from '@/@types/analysis'
import { findAlertDivergence, sortDivergencesBySeverity, splitAlertDescription } from '@/utils/alert'

function buildDivergence(field: string, severity: IDivergence['severity']): IDivergence {
	return { field, severity, description: 'x', occurrences: [], suggestion: 'y', confidence: 1 }
}

function buildAlert(description: string): IAlert {
	return {
		id: 'e0000000-0000-4000-8000-000000000001',
		severity: 'CRITICA',
		description,
		status: 'OPEN',
		resolution_note: null,
		shipment_id: null,
		validation_id: null,
		created_at: '2026-10-10T12:00:00Z',
		updated_at: '2026-10-10T12:00:00Z',
	}
}

const validation: IValidation = {
	id: 'b0000000-0000-4000-8000-000000000001',
	status: 'DIVERGENTE',
	details: 'x',
	confidence_score: 0.9,
	shipment_id: null,
	created_at: '2026-10-10T12:00:00Z',
	result: {
		status: 'DIVERGENTE',
		summary: 'x',
		documents: [],
		divergences: [buildDivergence('lacre', 'ALTA'), buildDivergence('número do contêiner', 'CRITICA')],
		confidence: 0.9,
	},
}

describe('splitAlertDescription', () => {
	it('separa campo, texto e sugestão', () => {
		expect(splitAlertDescription('lacre: O lacre diverge. Sugestão: Corrigir o lacre.')).toEqual({
			field: 'lacre',
			text: 'O lacre diverge.',
			suggestion: 'Corrigir o lacre.',
		})
	})

	it('aceita descrição sem sugestão', () => {
		expect(splitAlertDescription('peso bruto: O peso diverge.')).toEqual({
			field: 'peso bruto',
			text: 'O peso diverge.',
			suggestion: null,
		})
	})

	it('aceita descrição sem campo', () => {
		expect(splitAlertDescription('Divergência geral')).toEqual({ field: '', text: 'Divergência geral', suggestion: null })
	})
})

describe('findAlertDivergence', () => {
	it('encontra a divergência pelo campo', () => {
		expect(findAlertDivergence(buildAlert('lacre: diverge. Sugestão: corrigir.'), validation)?.severity).toBe('ALTA')
	})

	it('retorna undefined sem correspondência', () => {
		expect(findAlertDivergence(buildAlert('data de emissão: ausente.'), validation)).toBeUndefined()
		expect(findAlertDivergence(buildAlert('lacre: x'), undefined)).toBeUndefined()
	})
})

describe('sortDivergencesBySeverity', () => {
	it('ordena da crítica para a baixa sem alterar a lista original', () => {
		const list = [
			buildDivergence('a', 'BAIXA'),
			buildDivergence('b', 'CRITICA'),
			buildDivergence('c', 'MEDIA'),
			buildDivergence('d', 'ALTA'),
		]

		expect(sortDivergencesBySeverity(list).map((item) => item.severity)).toEqual(['CRITICA', 'ALTA', 'MEDIA', 'BAIXA'])
		expect(list[0].severity).toBe('BAIXA')
	})
})
