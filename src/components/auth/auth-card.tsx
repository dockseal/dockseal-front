import type { ReactNode } from 'react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ShineBorder } from '@/components/ui/shine-border'

interface IAuthCardProps {
	title: string
	description: string
	children: ReactNode
}

export function AuthCard({ title, description, children }: IAuthCardProps) {
	return (
		<Card className="relative w-full max-w-sm overflow-hidden">
			<ShineBorder shineColor={['#1257a1', '#234b63']} />
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardContent>{children}</CardContent>
		</Card>
	)
}
