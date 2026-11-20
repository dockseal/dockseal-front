import { createFileRoute, Link } from '@tanstack/react-router'

import { ShimmerButton } from '@/components/ui/shimmer-button'
import { useSessionStore } from '@/stores/session'
import { getLandingPath } from '@/utils/navigation'

export const Route = createFileRoute('/')({
	component: HomePage,
	head: () => ({
		meta: [{ title: 'Dockseal' }, { name: 'description', content: 'Plataforma inteligente de conformidade portuária' }],
	}),
})

function HomePage() {
	const accessToken = useSessionStore((state) => state.accessToken)
	const role = useSessionStore((state) => state.role)

	return (
		<div className="relative h-screen w-screen">
			<div className="relative z-10 mx-auto grid h-full max-w-300 place-items-center p-10">
				<div className="flex flex-col items-center justify-center gap-2">
					<h1 className="font-display text-4xl font-black">dockseal</h1>
					<p className="text-sm text-muted-foreground">Plataforma inteligente de conformidade portuária</p>
					<div className="flex items-center gap-2">
						<Link to={accessToken ? getLandingPath(role) : '/login'}>
							<ShimmerButton className="h-8" shimmerColor="#1257a1">
								{accessToken ? 'Acessar painel' : 'Entrar'}
							</ShimmerButton>
						</Link>
					</div>
				</div>
			</div>
		</div>
	)
}
