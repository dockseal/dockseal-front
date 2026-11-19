import { describe, expect, it } from 'vitest'

import { formatPercent, formatPercentValue } from '@/utils/number'

describe('number formatters', () => {
	it('formata razão como porcentagem', () => {
		expect(formatPercent(0.95)).toBe('95%')
		expect(formatPercent(1)).toBe('100%')
	})

	it('formata porcentagem já calculada', () => {
		expect(formatPercentValue(66.67)).toBe('67%')
		expect(formatPercentValue(null)).toBe('Sem dados')
	})
})
