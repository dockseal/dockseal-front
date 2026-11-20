import { CircleAlert } from 'lucide-react'
import type { ReactNode } from 'react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

interface IErrorStateProps {
	message: string
	title?: string
	onRetry?: () => void
	children?: ReactNode
}

export function ErrorState({ message, title = 'Não foi possível carregar', onRetry, children }: IErrorStateProps) {
	return (
		<Alert variant="destructive">
			<CircleAlert />
			<AlertTitle>{title}</AlertTitle>
			<AlertDescription>
				<p>{message}</p>
				<div className="mt-2 flex gap-2">
					{onRetry && (
						<Button type="button" size="sm" variant="outline" onClick={onRetry}>
							Tentar novamente
						</Button>
					)}
					{children}
				</div>
			</AlertDescription>
		</Alert>
	)
}
