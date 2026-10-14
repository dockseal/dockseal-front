import { describe, expect, it } from 'vitest'

import { hasNextPage, pageToOffset } from '@/utils/pagination'

describe('pagination', () => {
	it('converte página em offset', () => {
		expect(pageToOffset(1, 20)).toBe(0)
		expect(pageToOffset(3, 20)).toBe(40)
	})

	it('indica próxima página quando a página veio cheia', () => {
		expect(hasNextPage(Array.from({ length: 20 }), 20)).toBe(true)
		expect(hasNextPage(Array.from({ length: 7 }), 20)).toBe(false)
		expect(hasNextPage(undefined, 20)).toBe(false)
	})
})
