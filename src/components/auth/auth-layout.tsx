import type { ReactNode } from 'react'

import { AuthBrandPanel } from '@/components/auth/auth-brand-panel'
import { useTheme } from '@/components/theme-provider'
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler'

interface IAuthLayoutProps {
	children: ReactNode
}

export function AuthLayout({ children }: IAuthLayoutProps) {
	const { theme, setTheme } = useTheme()

	return (
		<div className="flex min-h-screen w-full">
			<AuthBrandPanel />
			<div className="flex flex-1 flex-col p-6 md:p-10">
				<div className="flex justify-end">
					<AnimatedThemeToggler theme={theme} onThemeChange={setTheme} duration={500} aria-label="Alternar tema" />
				</div>
				<div className="flex flex-1 items-center justify-center">{children}</div>
			</div>
		</div>
	)
}
