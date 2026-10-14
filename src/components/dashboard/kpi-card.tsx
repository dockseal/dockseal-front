import type { LucideIcon } from 'lucide-react'
import { useId } from 'react'

interface IKpiCardProps {
	title: string
	value: string
	hint?: string
	icon: LucideIcon
}

export function KpiCard({ title, value, hint, icon: Icon }: IKpiCardProps) {
	const titleId = useId()

	return (
		<section aria-labelledby={titleId} className="flex flex-col gap-2 rounded-xl border bg-card p-5">
			<div className="flex items-center justify-between gap-2">
				<h2 id={titleId} className="text-sm font-medium text-muted-foreground">
					{title}
				</h2>
				<Icon aria-hidden className="size-4 text-muted-foreground" />
			</div>
			<p className="text-3xl font-semibold tracking-tight">{value}</p>
			{hint && <p className="text-xs text-muted-foreground">{hint}</p>}
		</section>
	)
}
