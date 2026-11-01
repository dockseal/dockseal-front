import { createFileRoute } from '@tanstack/react-router'

import { AuthNotice } from '@/components/auth/auth-notice'

export const Route = createFileRoute('/_auth/request-access')({
	head: () => ({ meta: [{ title: 'Solicitar acesso | Dockseal' }] }),
	component: RequestAccessPage,
})

function RequestAccessPage() {
	return (
		<AuthNotice
			title="Solicitar acesso"
			message="O acesso à Dockseal é liberado pela equipe responsável. Solicite seu cadastro ao administrador da plataforma."
		/>
	)
}
