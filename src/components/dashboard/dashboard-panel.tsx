import { type ReactNode, useId } from 'react'

import { cn } from '@/lib/utils'

interface IDashboardPanelProps {
	title: string
	children: ReactNode
	className?: string
}

export function DashboardPanel({ title, children, className }: IDashboardPanelProps) {
	const titleId = useId()

	return (
		<section aria-labelledby={titleId} className={cn('flex flex-col gap-4 rounded-xl border bg-card p-5', className)}>
			<h2 id={titleId} className="font-medium">
				{title}
			</h2>
			{children}
		</section>
	)
}
