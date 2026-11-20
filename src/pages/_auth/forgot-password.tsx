import { createFileRoute } from '@tanstack/react-router'

import { AuthNotice } from '@/components/auth/auth-notice'

export const Route = createFileRoute('/_auth/forgot-password')({
	head: () => ({ meta: [{ title: 'Recuperar senha | Dockseal' }] }),
	component: PasswordRecoveryPage,
})

function PasswordRecoveryPage() {
	return (
		<AuthNotice
			title="Recuperar senha"
			message="A recuperação de senha é feita pelo administrador da plataforma. Entre em contato para redefinir sua senha."
		/>
	)
}
