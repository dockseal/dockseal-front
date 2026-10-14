import { Link } from '@tanstack/react-router'

import { AuthCard } from '@/components/auth/auth-card'
import { Button } from '@/components/ui/button'

interface IAuthNoticeProps {
	title: string
	message: string
}

export function AuthNotice({ title, message }: IAuthNoticeProps) {
	return (
		<AuthCard title={title} description={message}>
			<Button asChild variant="outline" className="w-full">
				<Link to="/login">Voltar para o login</Link>
			</Button>
		</AuthCard>
	)
}
