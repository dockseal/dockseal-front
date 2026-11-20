import type { TTone } from '@/@types/ui'

export const TONE_CLASS_NAME: Record<TTone, string> = {
	neutral: 'border-border bg-muted text-muted-foreground',
	success: 'border-emerald-600/30 bg-emerald-600/10 text-emerald-700 dark:text-emerald-300',
	warning: 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300',
	orange: 'border-orange-500/30 bg-orange-500/10 text-orange-700 dark:text-orange-300',
	danger: 'border-destructive/30 bg-destructive/10 text-destructive dark:text-red-300',
	info: 'border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300',
}
