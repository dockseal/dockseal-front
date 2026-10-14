import type { TTone } from '@/@types/ui'
import { Badge } from '@/components/ui/badge'
import { TONE_CLASS_NAME } from '@/constants/ui'
import { cn } from '@/lib/utils'

interface IStatusBadgeProps {
	label: string
	tone: TTone
	className?: string
}

export function StatusBadge({ label, tone, className }: IStatusBadgeProps) {
	return (
		<Badge variant="outline" className={cn(TONE_CLASS_NAME[tone], className)}>
			{label}
		</Badge>
	)
}
