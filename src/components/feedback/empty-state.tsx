import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

interface IEmptyStateProps {
	icon: LucideIcon
	title: string
	description?: string
	children?: ReactNode
}

export function EmptyState({ icon: Icon, title, description, children }: IEmptyStateProps) {
	return (
		<div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-10 text-center">
			<Icon className="size-8 text-muted-foreground" aria-hidden="true" />
			<p className="font-medium">{title}</p>
			{description && <p className="text-sm text-muted-foreground">{description}</p>}
			{children}
		</div>
	)
}
