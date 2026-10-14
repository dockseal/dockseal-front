import { Menu } from 'lucide-react'
import { useState } from 'react'

import { AppNav } from '@/components/app-shell/app-nav'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

export function MobileNav() {
	const [isOpen, setIsOpen] = useState(false)

	function handleNavigate() {
		setIsOpen(false)
	}

	return (
		<Sheet open={isOpen} onOpenChange={setIsOpen}>
			<SheetTrigger asChild>
				<Button type="button" variant="ghost" size="icon" className="md:hidden" aria-label="Abrir menu">
					<Menu />
				</Button>
			</SheetTrigger>
			<SheetContent side="left" className="w-72 p-4">
				<SheetHeader className="p-0">
					<SheetTitle className="font-display text-2xl font-normal">dockseal</SheetTitle>
					<SheetDescription className="sr-only">Menu de navegação</SheetDescription>
				</SheetHeader>
				<AppNav onNavigate={handleNavigate} />
			</SheetContent>
		</Sheet>
	)
}
