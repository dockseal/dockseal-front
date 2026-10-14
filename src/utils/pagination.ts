export function pageToOffset(page: number, limit: number) {
	return (Math.max(page, 1) - 1) * limit
}

export function hasNextPage(items: unknown[] | undefined, limit: number) {
	return (items?.length ?? 0) === limit
}
