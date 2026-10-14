import { Skeleton } from '@/components/ui/skeleton'

interface ILoadingStateProps {
	label?: string
	rows?: number
}

export function LoadingState({ label = 'Carregando…', rows = 3 }: ILoadingStateProps) {
	return (
		<div aria-busy="true" aria-label={label} className="flex flex-col gap-3">
			{Array.from({ length: rows }, (_, index) => (
				<Skeleton key={index} className="h-10 w-full" />
			))}
		</div>
	)
}
