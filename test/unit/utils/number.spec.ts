import { describe, expect, it } from 'vitest'

import { formatHours, formatPercent, formatPercentValue } from '@/utils/number'

describe('number formatters', () => {
	it('formata razão como porcentagem', () => {
		expect(formatPercent(0.95)).toBe('95%')
		expect(formatPercent(1)).toBe('100%')
	})

	it('formata porcentagem já calculada', () => {
		expect(formatPercentValue(66.67)).toBe('67%')
		expect(formatPercentValue(null)).toBe('Sem dados')
	})

	it('formata horas em pt-BR', () => {
		expect(formatHours(3)).toBe('3,0 h')
		expect(formatHours(36.5)).toBe('36,5 h')
		expect(formatHours(null)).toBe('Sem dados')
	})
})
