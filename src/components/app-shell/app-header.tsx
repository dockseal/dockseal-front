import { MobileNav } from '@/components/app-shell/mobile-nav'
import { UserMenu } from '@/components/app-shell/user-menu'
import { useTheme } from '@/components/theme-provider'
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler'

export function AppHeader() {
	const { theme, setTheme } = useTheme()

	return (
		<header className="flex h-14 items-center justify-between gap-2 border-b px-4">
			<MobileNav />
			<div className="ml-auto flex items-center gap-2">
				<AnimatedThemeToggler theme={theme} onThemeChange={setTheme} duration={500} aria-label="Alternar tema" />
				<UserMenu />
			</div>
		</header>
	)
}
