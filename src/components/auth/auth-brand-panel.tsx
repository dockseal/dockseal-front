import { Link } from '@tanstack/react-router'

import { useTheme } from '@/components/theme-provider'
import { DotPattern } from '@/components/ui/dot-pattern'
import { cn } from '@/lib/utils'

export function AuthBrandPanel() {
	const { theme } = useTheme()

	return (
		<div
			className={cn('relative hidden flex-1 border-r bg-linear-to-tl via-background to-background p-10 md:block', {
				'from-secondary': theme === 'light',
				'from-primary': theme === 'dark',
			})}
		>
			<Link to="/">
				<span className="relative z-10 font-display text-3xl">dockseal</span>
			</Link>
			<DotPattern
				width={20}
				height={20}
				cx={1}
				cy={1}
				cr={1}
				className={cn('mask-[linear-gradient(to_bottom_right,white,transparent,transparent)]')}
			/>
		</div>
	)
}
