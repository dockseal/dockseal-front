import { createFileRoute, Link } from '@tanstack/react-router'

import { ShimmerButton } from '@/components/ui/shimmer-button'

export const Route = createFileRoute('/')({
	component: HomePage,
	head: () => ({
		meta: [{ title: 'Dockseal' }, { name: 'description', content: 'Dockseal is a platform for managing containers' }],
	}),
})

function HomePage() {
	return (
		<div className="relative w-screen h-screen">
			<div className="relative z-10 h-full max-w-300 mx-auto p-10 grid place-items-center">
				<div className="flex flex-col gap-2 items-center justify-center">
					<h1 className="text-4xl font-black font-display">dockseal</h1>
					<div className="flex gap-2 items-center">
						<Link to="/sign-in">
							<ShimmerButton className="h-8" shimmerColor="#1257a1">
								Sign In
							</ShimmerButton>
						</Link>
					</div>
				</div>
			</div>
			{/* <DotPattern className={cn('mask-[radial-gradient(300px_circle_at_center,white,transparent)]')} /> */}
		</div>
	)
}
